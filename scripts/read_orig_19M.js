import ExcelJS from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/exceljs/dist/es5/index.js';
async function readAll19M() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2019_19M.xlsx');
  const ws = wb.worksheets[0];
  console.log('Total rows in orig 19M:', ws.rowCount);
  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).value;
    if (stt && !isNaN(Number(stt))) {
      console.log(`STT: ${String(stt).padEnd(3)} | ToSo: ${String(row.getCell(6).text).padEnd(10)} | So: ${String(row.getCell(2).text).padEnd(16)} | Ngay: ${String(row.getCell(3).text).padEnd(10)} | ${(row.getCell(4).text||'').slice(0, 35)}`);
    }
  }
}
readAll19M();
