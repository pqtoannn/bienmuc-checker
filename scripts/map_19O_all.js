import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19O.job.json', 'utf8'));

console.log('Mapping all 109 photos in 19O:');
for (let i = 0; i < j.data.rows.length; i++) {
  const r = j.data.rows[i];
  const fn = j.images[i] ? j.images[i].fileName : '';
  const num = parseInt(fn.replace('.jpg', ''), 10);
  console.log(`${String(num).padStart(3)} | toSo: ${String(r.toSoTrangSo||'').padEnd(8)} | so: ${String(r.soKyHieuVanBan||'').padEnd(16)} | ngay: ${String(r.ngayThangVanBan||'').padEnd(10)} | trichYeu: ${(r.tenLoaiTrichYeu||'').slice(0, 35)}`);
}
