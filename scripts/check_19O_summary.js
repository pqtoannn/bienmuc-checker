import fs from 'fs';
const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19O.job.json', 'utf8'));

console.log('Images count in 19O:', j.images.length);
console.log('Rows count in 19O:', j.data.rows.length);

let emptyToSo = 0;
let emptySo = 0;
let emptyNgay = 0;

for (let i = 0; i < j.data.rows.length; i++) {
  const r = j.data.rows[i];
  const fn = j.images[i] ? j.images[i].fileName : '';
  if (!r.toSoTrangSo) emptyToSo++;
  if (!r.soKyHieuVanBan) emptySo++;
  if (!r.ngayThangVanBan) emptyNgay++;

  if (i < 8 || i > j.data.rows.length - 8) {
    console.log(`[${String(i).padStart(3)}] ${fn} | STT: ${String(r.soTT).padEnd(3)} | ToSo: ${String(r.toSoTrangSo).padEnd(8)} | So: ${String(r.soKyHieuVanBan).padEnd(16)} | Ngay: ${String(r.ngayThangVanBan).padEnd(10)} | ${(r.tenLoaiTrichYeu||'').slice(0, 35)}`);
  }
}

console.log(`Empty stats: toSo=${emptyToSo}, so=${emptySo}, ngay=${emptyNgay}`);
