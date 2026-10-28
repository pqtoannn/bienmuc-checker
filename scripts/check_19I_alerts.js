import fs from 'fs';

const jobI = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19I.job.json', 'utf8'));

console.log('--- CHECKING 19I ROWS ---');
for (let i = 1; i < jobI.data.rows.length; i++) {
  const r = jobI.data.rows[i];
  const fn = r.sourceFileNames[0];
  const missing = [];
  if (!r.soKyHieuVanBan || r.soKyHieuVanBan.includes('//')) missing.push('soHieu');
  if (!r.ngayThangVanBan) missing.push('ngay');
  if (!r.tacGiaVanBan) missing.push('tacGia');
  if (!r.tenLoaiTrichYeu) missing.push('trichYeu');

  if (missing.length > 0) {
    console.log(`Alert row ${i} (${fn}): missing [${missing.join(', ')}] | so: '${r.soKyHieuVanBan}' | ngay: '${r.ngayThangVanBan}' | trichYeu: '${r.tenLoaiTrichYeu ? r.tenLoaiTrichYeu.slice(0, 30) : ''}'`);
  }
}
