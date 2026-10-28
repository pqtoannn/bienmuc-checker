import fs from 'fs';

const jZ = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2021_21Z.job.json', 'utf8'));
console.log('=== PL_2021_21Z ROWS ===');
jZ.data.rows.forEach((r, idx) => {
  console.log(`[${idx+1}] File: ${r.sourceFileNames ? r.sourceFileNames.join(',') : ''} | So: ${r.soKyHieuVanBan} | Ngay: ${r.ngayThangVanBan} | To: ${r.toSoTrangSo} | Loai: ${r.loaiBan} | TrichYeu: ${r.tenLoaiTrichYeu}`);
});

const jY = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2021_21Y.job.json', 'utf8'));
console.log('\n=== PL_2021_21Y ROWS (First 10 & Last 10) ===');
console.log('Total rows in Y:', jY.data.rows.length);
jY.data.rows.slice(0, 5).forEach((r, idx) => {
  console.log(`[${idx+1}] File: ${r.sourceFileNames ? r.sourceFileNames.join(',') : ''} | So: ${r.soKyHieuVanBan} | Ngay: ${r.ngayThangVanBan} | To: ${r.toSoTrangSo} | TrichYeu: ${r.tenLoaiTrichYeu}`);
});
console.log('...');
jY.data.rows.slice(-5).forEach((r, idx) => {
  console.log(`[${jY.data.rows.length - 5 + idx + 1}] File: ${r.sourceFileNames ? r.sourceFileNames.join(',') : ''} | So: ${r.soKyHieuVanBan} | Ngay: ${r.ngayThangVanBan} | To: ${r.toSoTrangSo} | TrichYeu: ${r.tenLoaiTrichYeu}`);
});
