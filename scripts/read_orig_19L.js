import ExcelJS from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/exceljs/dist/es5/index.js';
async function readAll19L() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2019_19L.xlsx');
  const ws = wb.worksheets[0];
  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).value;
    if (stt && !isNaN(Number(stt))) {
      console.log(`STT: ${stt} | so: ${row.getCell(2).text} | ngay: ${row.getCell(3).text} | toSo: ${row.getCell(6).text} | loaiBan: ${row.getCell(7).text} | trichYeu: ${(row.getCell(4).text||'').slice(0, 45)}`);
    }
  }
}
readAll19L();
