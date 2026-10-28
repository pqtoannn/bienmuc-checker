import fs from 'fs';

const jobE = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19E.job.json', 'utf8'));

console.log('Total rows:', jobE.data.rows.length);
for (const r of jobE.data.rows) {
  const fn = r.sourceFileNames ? r.sourceFileNames.join(',') : '';
  console.log(`STT: ${String(r.soTT).padEnd(3)} | File: ${fn.padEnd(10)} | Trang: ${String(r.toSoTrangSo || '').padEnd(10)} | SoHieu: ${String(r.soKyHieuVanBan || '').padEnd(16)} | Ngay: ${String(r.ngayThangVanBan || '').padEnd(12)} | TrichYeu: ${(r.tenLoaiTrichYeu || '').slice(0, 50)}`);
}
