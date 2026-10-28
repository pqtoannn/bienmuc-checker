import fs from 'fs';

const jobPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2022_22R.job.json';
const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

console.log('Total rows:', job.data.rows.length);
job.data.rows.forEach((r, i) => {
  const fn = job.images[i]?.fileName;
  console.log(`[${i+1}] ${fn} | So: ${r.soKyHieuVanBan || ''} | Ngay: ${r.ngayThangVanBan || ''} | To: ${r.toSoTrangSo || ''} | Loai: ${r.loaiBan}`);
  console.log(`    TG: ${r.tacGiaVanBan}`);
  console.log(`    TY: ${r.tenLoaiTrichYeu}`);
});
