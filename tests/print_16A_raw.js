import path from 'path';
import ExcelJS from 'exceljs';

const P_RAW_EXCEL = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check';

async function print16A() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2016_16A.xlsx'));
  const ws = wb.worksheets[0];
  console.log('Total rows:', ws.rowCount);
  for (let r = 7; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const vals = [1,2,3,4,5,6,7,8].map(c => row.getCell(c).text?.trim() || '');
    if (vals.some(v => v)) {
      console.log(`Row ${r - 6} (Excel row ${r}):`, JSON.stringify(vals));
    }
  }
}
print16A();
