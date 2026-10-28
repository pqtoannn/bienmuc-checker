import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16D.xlsx');
  const ws = wb.worksheets[0];

  // List all raw rows from 8 to 140
  // Exclude:
  // row 126 (120.jpg) - duplicate of 119.jpg
  // row 140 (134.jpg) - duplicate of 133.jpg
  // Merge row 106 & 107 (100.jpg & 101.jpg)
  const docs = [];
  for (let r = 8; r <= 140; r++) {
    const img = String(r - 6).padStart(3, '0') + '.jpg';
    if (r === 126) {
      console.log(`Skipping duplicate row ${r} (${img})`);
      continue;
    }
    if (r === 140) {
      console.log(`Skipping duplicate row ${r} (${img})`);
      continue;
    }
    if (r === 107) {
      console.log(`Merging row ${r} (${img}) into previous row (100.jpg)`);
      docs[docs.length - 1].files.push(img);
      continue;
    }
    const row = ws.getRow(r);
    docs.push({
      r,
      img,
      files: [img],
      so: row.getCell(2).text?.trim() || '',
      d: row.getCell(3).text?.trim() || '',
      toSo: row.getCell(6).text?.trim() || '',
      trich: row.getCell(4).text?.trim() || ''
    });
  }

  console.log(`Total active docs compiled: ${docs.length}`);
}
main();
