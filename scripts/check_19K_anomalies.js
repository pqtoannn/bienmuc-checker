import fs from 'fs';
const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19K.job.json', 'utf8'));

console.log('Anomalies in 19K:');
for (let i = 0; i < j.data.rows.length; i++) {
  const r = j.data.rows[i];
  const fn = j.images[i] ? j.images[i].fileName : '';
  if (!r.toSoTrangSo || !r.soKyHieuVanBan || !r.ngayThangVanBan) {
    console.log(`[${String(i).padStart(2)}] ${fn} | STT: ${String(r.soTT).padEnd(3)} | ToSo: '${r.toSoTrangSo}' | So: '${r.soKyHieuVanBan}' | Ngay: '${r.ngayThangVanBan}' | TrichYeu: ${(r.tenLoaiTrichYeu||'').slice(0, 45)}`);
  }
}
