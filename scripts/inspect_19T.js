import fs from 'fs';
import ExcelJS from 'exceljs';

const job = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19T.job.json', 'utf8'));
console.log('=== 19T JOB DATA ===');
job.data.rows.forEach((r, i) => {
  console.log(`[${i+1}] File: ${r.sourceFileNames?.join(',')} | Số: '${r.soKyHieuVanBan || ''}' | Ngày: '${r.ngayThangVanBan || ''}' | Tờ: '${r.toSoTrangSo}' | Tác giả: '${r.tacGiaVanBan}' | Trích yếu: '${r.tenLoaiTrichYeu}'`);
});

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2019_19T.xlsx');
const ws = wb.worksheets[0];
console.log('\n=== 19T RAW EXCEL ===');
for (let r = 1; r <= ws.rowCount; r++) {
  console.log(r, ws.getRow(r).values);
}
