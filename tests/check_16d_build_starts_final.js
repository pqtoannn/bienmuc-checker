import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16D.xlsx');
  const ws = wb.worksheets[0];

  // We compile all active documents
  // Total raw rows in ws: row 8 (002.jpg) to row 140 (134.jpg)
  const items = [];
  for (let r = 8; r <= 140; r++) {
    const img = String(r - 6).padStart(3, '0') + '.jpg';
    const row = ws.getRow(r);
    const so = row.getCell(2).text?.trim() || '';
    const d = row.getCell(3).text?.trim() || '';
    const trich = row.getCell(4).text?.trim() || '';
    const tg = row.getCell(5).text?.trim() || 'Ủy ban nhân dân xã Phú Lộc';
    const loaiBan = row.getCell(7).text?.trim() || 'Bản gốc';
    const toSo = row.getCell(6).text?.trim() || '';

    items.push({ r, img, so, d, trich, tg, loaiBan, toSo });
  }

  // Filter & merge:
  // Duplicates to skip:
  // 088.jpg (r=94)
  // 120.jpg (r=126)
  // 134.jpg (r=140)
  // Merges:
  // 084.jpg (r=90) merges into 083.jpg (r=89)
  // 101.jpg (r=107) merges into 100.jpg (r=106)
  const activeDocs = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (['088.jpg', '120.jpg', '134.jpg'].includes(item.img)) {
      continue;
    }
    if (item.img === '084.jpg') {
      // merge into 083.jpg
      activeDocs[activeDocs.length - 1].files.push('084.jpg');
      continue;
    }
    if (item.img === '101.jpg') {
      // merge into 100.jpg
      activeDocs[activeDocs.length - 1].files.push('101.jpg');
      continue;
    }
    activeDocs.push({
      ...item,
      files: [item.img]
    });
  }

  console.log(`Compiled activeDocs length: ${activeDocs.length}`);

  // Now let's print all 128 documents with their raw toSo and so
  activeDocs.forEach((doc, idx) => {
    console.log(`[${idx+1}] files: ${JSON.stringify(doc.files)} | rawTo: ${doc.toSo} | so: ${doc.so} | d: ${doc.d}`);
  });
}
main();
