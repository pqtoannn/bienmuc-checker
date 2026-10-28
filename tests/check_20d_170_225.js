import fs from 'fs';

const jD = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20D.job.json', 'utf8'));

console.log('=== PHOTOS 170 TO 225 FULL DATA ===');
for (let i = 170; i <= 225; i++) {
  const r = jD.data.rows[i - 1];
  console.log(`${i}: file=${r.sourceFileNames[0]} | so=${r.soKyHieuVanBan} | ngay=${r.ngayThangVanBan} | to=${r.toSoTrangSo} | trichYeu=${(r.tenLoaiTrichYeu||'').substring(0,40)}`);
}
