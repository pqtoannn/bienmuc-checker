import fs from 'fs';

const job = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19R.job.json', 'utf8'));

console.log(`=== JOB 19R ROWS (${job.data.rows.length}) ===`);
job.data.rows.forEach((r, i) => {
  console.log(`[${String(i+1).padStart(2, '0')}] Files: ${r.sourceFileNames?.join(',')} | Số: '${r.soKyHieuVanBan || ''}' | Ngày: '${r.ngayThangVanBan || ''}' | Tác giả: '${r.tacGiaVanBan || ''}' | Tờ: '${r.toSoTrangSo || ''}' | Trích yếu: '${(r.tenLoaiTrichYeu || '').slice(0, 50)}'`);
});
