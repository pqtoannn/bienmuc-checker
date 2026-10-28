import fs from 'fs';

const jobV = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19V.job.json', 'utf8'));

console.log('=== PL_2019_19V Rows ===');
jobV.data.rows.forEach((r, idx) => {
  console.log(`Row ${idx + 1} (${r.sourceFileNames.join(',')}):`);
  console.log(`  Số/KH: '${r.soKyHieuVanBan}' | Ngày: '${r.ngayThangVanBan}' | Tác giả: '${r.tacGiaVanBan}'`);
  console.log(`  Trích yếu: '${r.tenLoaiTrichYeu}'`);
  console.log(`  Tờ: '${r.toSoTrangSo}' | Loại: '${r.loaiBan}' | Ghi chú: '${r.ghiChu}'`);
});
