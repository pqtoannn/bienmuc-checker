import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16G.xlsx');
  const ws = wb.worksheets[0];

  console.log(`16G total raw rows: ${ws.rowCount}`);
  const rows = [];
  for (let r = 8; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).text?.trim();
    const so = row.getCell(2).text?.trim();
    const d = row.getCell(3).text?.trim();
    const trich = row.getCell(4).text?.trim();
    const tg = row.getCell(5).text?.trim();
    const toSo = row.getCell(6).text?.trim();
    const loaiBan = row.getCell(7).text?.trim();
    const img = String(r - 6).padStart(3, '0') + '.jpg';
    rows.push({ r, img, stt, so, d, toSo, trich: trich.slice(0, 35) });
  }

  fs.writeFileSync('tests/inspect_batch2016_5/16G_raw_rows.json', JSON.stringify(rows, null, 2), 'utf8');
  console.log('Saved 16G_raw_rows.json');
}
main();
