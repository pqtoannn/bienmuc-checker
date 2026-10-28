import fs from 'fs';
import ExcelJS from 'exceljs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16H.xlsx');
  const ws = wb.worksheets[0];

  // Raw rows 8 to 117
  // Note: row 23 is 017.jpg (duplicate of 016.jpg)
  const rows = [];
  for (let r = 8; r <= 117; r++) {
    const row = ws.getRow(r);
    const toSo = row.getCell(6).text?.trim();
    const so = row.getCell(2).text?.trim();
    const d = row.getCell(3).text?.trim();
    const ty = row.getCell(4).text?.trim();
    rows.push({ r, img: String(r - 6).padStart(3, '0') + '.jpg', so, d, toSo, ty });
  }

  console.log(`Total 16H rows: ${rows.length}`);
  // Let's filter out 017.jpg duplicate
  const active = rows.filter(x => x.img !== '017.jpg');
  console.log(`Active docs: ${active.length}`);
  active.forEach((x, i) => {
    console.log(`[${i+1}] ${x.img}: rawTo=${x.toSo} | so=${x.so} | d=${x.d}`);
  });
}
main();
