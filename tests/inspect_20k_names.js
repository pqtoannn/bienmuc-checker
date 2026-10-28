import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20K.job.json', 'utf8'));

for (let i = 1; i <= 13; i++) {
  const r = j.data.rows[i];
  console.log(`\n=== Doc ${i} (${r.sourceFileNames[0]}): to=${r.toSoTrangSo} ===`);
  console.log('tacGia:', r.tacGiaVanBan);
  console.log('date:', r.ngayThangVanBan);
  console.log('tenLoaiTrichYeu:', r.tenLoaiTrichYeu);
}
