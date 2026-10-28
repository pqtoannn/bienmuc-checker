import fs from 'fs';
const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19L.job.json', 'utf8'));
j.data.rows.forEach((r, idx) => {
  const fn = j.images[idx] ? j.images[idx].fileName : '';
  console.log(`[${idx}] fn: ${fn} | soTT: ${r.soTT} | so: ${r.soKyHieuVanBan} | ngay: ${r.ngayThangVanBan} | toSo: ${r.toSoTrangSo} | trichYeu: ${(r.tenLoaiTrichYeu||'').slice(0, 45)}`);
});
