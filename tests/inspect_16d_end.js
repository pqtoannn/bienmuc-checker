import ExcelJS from 'exceljs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16D.xlsx');
  const ws = wb.worksheets[0];
  console.log('Total rows 16D:', ws.rowCount);
  for (let r = ws.rowCount - 5; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    console.log(`R${r}: [${row.getCell(1).text}] [${row.getCell(2).text}] [${row.getCell(3).text}] [${row.getCell(6).text}] ${row.getCell(4).text}`);
  }
}
main();
