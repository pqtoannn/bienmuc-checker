import ExcelJS from 'exceljs';

async function checkRaw19S() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2019_19S.xlsx');
  const ws = wb.worksheets[0];
  console.log(`=== RAW EXCEL 19S (Row count: ${ws.rowCount}) ===`);
  for (let r = 1; r <= Math.min(ws.rowCount, 65); r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).value;
    const so = row.getCell(2).value || '';
    const ngay = row.getCell(3).value || '';
    const trichYeu = row.getCell(4).value || '';
    const tacGia = row.getCell(5).value || '';
    const toSo = row.getCell(6).value || '';
    const loai = row.getCell(7).value || '';
    const ghiChu = row.getCell(8).value || '';

    if (r <= 5) {
      console.log(`Header [${r}]:`, row.values);
    } else {
      console.log(`Row [${r-5}] STT=${stt} | Số='${so}' | Ngày='${ngay}' | Tờ='${toSo}' | Tác giả='${tacGia}' | Trích yếu='${String(trichYeu).slice(0, 50)}'`);
    }
  }
}

checkRaw19S().catch(console.error);
