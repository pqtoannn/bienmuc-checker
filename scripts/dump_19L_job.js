import fs from 'fs';
const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19L.job.json', 'utf8'));

for (let i = 0; i < j.data.rows.length; i++) {
  const r = j.data.rows[i];
  const img = j.images[i] ? j.images[i].fileName : '';
  console.log(`=== ROW ${i} (image ${img}) ===`);
  console.log(`  soTT: '${r.soTT}'`);
  console.log(`  soKyHieu: '${r.soKyHieuVanBan}'`);
  console.log(`  ngay: '${r.ngayThangVanBan}'`);
  console.log(`  toSo: '${r.toSoTrangSo}'`);
  console.log(`  trichYeu: '${r.tenLoaiTrichYeu}'`);
  console.log(`  tacGia: '${r.tacGiaVanBan}'`);
  console.log(`  loaiBan: '${r.loaiBan}'`);
}
