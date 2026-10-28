import fs from 'fs';
const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19K.job.json', 'utf8'));

const suspectIdxs = [8, 9, 10, 11, 12, 16, 17, 18, 24, 25, 26, 35, 36, 37, 43, 44, 45, 86, 87, 88, 89, 96, 97, 98];

console.log('Surrounding details:');
for (const idx of suspectIdxs) {
  const r = j.data.rows[idx];
  const fn = j.images[idx] ? j.images[idx].fileName : '';
  console.log(`[${String(idx).padStart(2)}] ${fn} | STT: ${String(r.soTT).padEnd(3)} | ToSo: '${String(r.toSoTrangSo||'').padEnd(6)}' | So: '${String(r.soKyHieuVanBan||'').padEnd(16)}' | Ngay: '${String(r.ngayThangVanBan||'').padEnd(10)}' | ${(r.tenLoaiTrichYeu||'').slice(0, 40)}`);
}
