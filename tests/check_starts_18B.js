import fs from 'fs';
import path from 'path';

const jobPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2018_18B.job.json';
const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

console.log('--- ALL ROWS IN 18B ---');
job.data.rows.forEach((r, idx) => {
  const p = r.sourceFileNames ? r.sourceFileNames[0] : `idx_${idx}`;
  console.log(`${p}: toSoTrangSo="${r.toSoTrangSo}" | so="${r.soKyHieuVanBan}" | ngay="${r.ngayThangVanBan}" | tg="${r.tacGiaVanBan}" | ty="${(r.tenLoaiTrichYeu || '').slice(0, 50)}"`);
});
