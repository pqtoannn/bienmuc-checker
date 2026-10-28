import fs from 'fs';

const jobG = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19G.job.json', 'utf8'));

console.log('Images in jobG:', jobG.images.length);
console.log('Rows in jobG:', jobG.data.rows.length);

for (const r of jobG.data.rows) {
  const fns = r.sourceFileNames ? r.sourceFileNames.join(',') : '';
  console.log(`STT: ${String(r.soTT).padEnd(3)} | Files: ${fns.padEnd(25)} | ToSo: ${String(r.toSoTrangSo || '').padEnd(10)} | SoHieu: ${String(r.soKyHieuVanBan || '').padEnd(16)} | Ngay: ${String(r.ngayThangVanBan || '').padEnd(12)} | TrichYeu: ${(r.tenLoaiTrichYeu || '').slice(0, 45)}`);
}
