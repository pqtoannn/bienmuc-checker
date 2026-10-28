import fs from 'fs';

const filePath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2022_22S.job.json';
const job = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('soHoSo:', job.soHoSo);
console.log('soKyHieuHoSo:', job.data?.soKyHieuHoSo);
console.log('tenHoSo:', job.data?.tenHoSo);
console.log('namGiaiDoan:', job.data?.namGiaiDoan);
console.log('thoiGianHoSo:', job.data?.thoiGianHoSo);
console.log('Rows count:', job.data?.rows?.length);

job.data?.rows?.forEach((r, i) => {
  const fn = job.images?.[i] ? job.images[i].fileName : '?';
  console.log(`--- [${i}] ${fn} ---`);
  console.log(`isExcluded: ${r.isExcluded} | soTT: ${r.soTT}`);
  console.log(`soKyHieu: ${r.soKyHieuVanBan} | ngayThang: ${r.ngayThangVanBan} | toSo: ${r.toSoTrangSo} | loaiBan: ${r.loaiBan}`);
  console.log(`tacGia: ${r.tacGiaVanBan}`);
  console.log(`trichYeu: ${r.tenLoaiTrichYeu}`);
  console.log(`ghiChu: ${r.ghiChu}`);
});
