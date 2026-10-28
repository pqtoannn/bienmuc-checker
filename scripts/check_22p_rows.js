import fs from 'fs';

const jobPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2022_22P.job.json';
const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

console.log('Total images:', job.images.length);
console.log('Total rows:', job.data.rows.length);

// Let's print out all rows to inspect text details
const rows = job.data.rows;
for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  const f = job.images[i]?.fileName;
  console.log(`${f} | STT:${r.soTT} | Số:${r.soKyHieuVanBan} | Ngày:${r.ngayThangVanBan} | Tờ:${r.toSoTrangSo} | LB:${r.loaiBan} | TY:${r.tenLoaiTrichYeu}`);
}
