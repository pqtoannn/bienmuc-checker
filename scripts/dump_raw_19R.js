import ExcelJS from 'exceljs';

async function dumpRaw19R() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2019_19R.xlsx');
  const ws = wb.worksheets[0];
  console.log(`=== RAW EXCEL PL_2019_19R (${ws.rowCount} rows) ===`);
  for (let r = 6; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).value;
    const so = row.getCell(2).value || '';
    const ngay = row.getCell(3).value || '';
    const trichYeu = row.getCell(4).value || '';
    const tacGia = row.getCell(5).value || '';
    const toSo = row.getCell(6).value || '';
    const loaiBan = row.getCell(7).value || '';
    const ghiChu = row.getCell(8).value || '';
    if (!stt && !trichYeu) continue;
    console.log(`Row ${r - 5}: STT=${stt} | Số='${so}' | Ngày='${ngay}' | Tờ='${toSo}' | Tác giả='${tacGia}' | Trích yếu='${trichYeu.slice(0, 60)}' | Loại='${loaiBan}' | Ghi chú='${ghiChu}'`);
  }
}

dumpRaw19R().catch(console.error);
