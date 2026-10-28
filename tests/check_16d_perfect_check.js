import ExcelJS from 'exceljs';
import fs from 'fs';

function formatRange(start, end) {
  const sStr = String(start).padStart(2, '0');
  if (start === end) return sStr;
  const eStr = String(end).padStart(2, '0');
  return `${sStr}-${eStr}`;
}

async function test() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16D.xlsx');
  const ws = wb.worksheets[0];
  const activeDocs = [];
  for (let r = 8; r <= 140; r++) {
    const img = String(r - 6).padStart(3, '0') + '.jpg';
    if (['088.jpg', '120.jpg', '134.jpg'].includes(img)) continue;
    if (img === '084.jpg') {
      activeDocs[activeDocs.length - 1].files.push('084.jpg');
      continue;
    }
    if (img === '101.jpg') {
      activeDocs[activeDocs.length - 1].files.push('101.jpg');
      continue;
    }
    activeDocs.push({ idx: activeDocs.length + 1, img, files: [img], rawTo: ws.getRow(r).getCell(6).text?.trim(), so: ws.getRow(r).getCell(2).text?.trim() });
  }

  // Exactly 128 starts:
  const startsD = [
    // 1 to 20: 002-021
    1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 16, 18, 25, 26, 27, 28, 33, 34,
    // 21 to 40: 022-041
    37, 40, 41, 45, 50, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70,
    // 41 to 60: 042-061
    72, 73, 74, 75, 76, 80, 83, 84, 85, 86, 87, 89, 90, 91, 92, 96, 97, 98, 99, 101,
    // 61 to 80: 062-081
    102, 103, 105, 106, 107, 108, 109, 110, 111, 114, 118, 121, 122, 123, 125, 126, 128, 129, 130, 131,
    // 81 to 100: 082 to 103 (083+084 is 1 doc, 100+101 is 1 doc)
    132, 135, 136, 137, 138, 139, 140, 141, 143, 144, 146, 147, 149, 151, 152, 154, 156, 157, 158, 159,
    // 101 to 120: 104 to 124
    160, 161, 162, 163, 164, 165, 166, 169, 173, 175, 179, 181, 182, 186, 187, 189, 190, 191, 192, 193,
    // 121 to 128: 125 to 133 (8 docs: 125.jpg is doc 121 -> 192? Wait!)
  ];

  // Let's do it by mapping each doc directly!
}
