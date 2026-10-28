import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16D.xlsx');
  const ws = wb.worksheets[0];

  // We have 132 active docs (from raw row 8 to 139)
  // Raw row 140 is 134.jpg duplicate
  console.log('Compiling 16D starts...');
  const starts = [];
  for (let r = 8; r <= 139; r++) {
    const toSo = ws.getRow(r).getCell(6).text?.trim();
    const parts = toSo.split('-');
    const s = parseInt(parts[0], 10);
    starts.push({ r, img: String(r - 6).padStart(3, '0') + '.jpg', toSo, s });
  }

  console.log(`Loaded ${starts.length} raw items.`);
  for (let i = 0; i < starts.length; i++) {
    const curr = starts[i];
    const prev = i > 0 ? starts[i - 1] : null;
    console.log(`[${i + 1}] ${curr.img} | rawTo: ${curr.toSo} | s=${curr.s}`);
  }
}
main();
