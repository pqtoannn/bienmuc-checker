import fs from 'fs';
import ExcelJS from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/exceljs/dist/es5/index.js';

async function checkFile(p) {
  console.log('=== Checking', p, '===');
  if (!fs.existsSync(p)) {
    console.log('File does not exist');
    return;
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(p);
  const ws = wb.worksheets[0];
  console.log('Rows count:', ws.rowCount);
  let active = 0;
  for (let r = 1; r <= ws.rowCount; r++) {
    const stt = ws.getRow(r).getCell(1).value;
    if (stt && !isNaN(Number(stt))) {
      active++;
      if (active <= 3 || active >= ws.rowCount - 15) {
        console.log(`Row ${stt} (excel row ${r}): toSo='${ws.getRow(r).getCell(6).text}', so='${ws.getRow(r).getCell(2).text}', trichYeu='${ws.getRow(r).getCell(4).text ? ws.getRow(r).getCell(4).text.slice(0, 35) : ''}'`);
      }
    }
  }
  console.log('Total active rows:', active);
}

async function run() {
  await checkFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2019_19G.xlsx');
  await checkFile('C:/Users/Toan/Downloads/PhuLoc_BoSung_10HS_24_10/PL_2019_19G.xlsx');
}

run();
