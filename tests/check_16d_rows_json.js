import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16D.xlsx');
  const ws = wb.worksheets[0];

  const results = [];
  for (let r = 8; r <= 139; r++) {
    const row = ws.getRow(r);
    const imgName = String(r - 6).padStart(3, '0') + '.jpg';
    const so = row.getCell(2).text?.trim() || '';
    const ngay = row.getCell(3).text?.trim() || '';
    const trich = row.getCell(4).text?.trim() || '';
    const tg = row.getCell(5).text?.trim() || '';
    const toSo = row.getCell(6).text?.trim() || '';
    results.push({ r, img: imgName, so, ngay, trich: trich.slice(0, 40), tg, toSo });
  }

  console.log(`Total active rows: ${results.length}`);
  fs.writeFileSync('tests/inspect_batch2016_4/16D_rows.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Saved 16D_rows.json');
}
main();
