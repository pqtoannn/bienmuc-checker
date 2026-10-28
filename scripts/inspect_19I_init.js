import fs from 'fs';

const jobI = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19I.job.json', 'utf8'));

console.log('duAnTen:', jobI.duAnTen);
console.log('soHoSo:', jobI.soHoSo);
console.log('Images count:', jobI.images.length);
console.log('Rows count:', jobI.data.rows.length);
console.log('Metadata:', JSON.stringify({
  donVi: jobI.data.donVi,
  soKyHieuHoSo: jobI.data.soKyHieuHoSo,
  tenHoSo: jobI.data.tenHoSo,
  namGiaiDoan: jobI.data.namGiaiDoan,
  thoiGianHoSo: jobI.data.thoiGianHoSo,
  tongSoToText: jobI.data.tongSoToText
}, null, 2));

console.log('First 5 rows:');
jobI.data.rows.slice(0, 5).forEach(r => console.log(r.soTT, r.soKyHieuVanBan, r.ngayThangVanBan, r.toSoTrangSo, r.sourceFileNames));
console.log('Last 5 rows:');
jobI.data.rows.slice(-5).forEach(r => console.log(r.soTT, r.soKyHieuVanBan, r.ngayThangVanBan, r.toSoTrangSo, r.sourceFileNames));
