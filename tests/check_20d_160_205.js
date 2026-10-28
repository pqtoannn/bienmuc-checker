import fs from 'fs';

const jD = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20D.job.json', 'utf8'));

// Print rows 160 to 205
for (let i = 160; i <= 205; i++) {
  const r = jD.data.rows[i - 1];
  console.log(`[${i}] ${r.sourceFileNames[0]} | to="${r.toSoTrangSo}" | so="${r.soKyHieuVanBan}" | ngay="${r.ngayThangVanBan}" | trichYeu="${(r.tenLoaiTrichYeu||'').substring(0,35)}"`);
}
