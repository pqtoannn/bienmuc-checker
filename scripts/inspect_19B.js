import fs from 'fs';
import path from 'path';

const jobPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19B.job.json';
const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

console.log('--- METADATA 19B ---');
console.log('soKyHieuHoSo:', job.data?.soKyHieuHoSo);
console.log('tenHoSo:', job.data?.tenHoSo);
console.log('tieuDeNghiQuyet:', job.data?.tieuDeNghiQuyet);
console.log('namGiaiDoan:', job.data?.namGiaiDoan);
console.log('thoiGianHoSo:', job.data?.thoiGianHoSo);
console.log('donVi:', job.data?.donVi);

console.log('\n--- ROWS OVERVIEW 19B ---');
console.log('Total rows:', job.data?.rows?.length);
console.log('First 5 rows:');
for (let i = 0; i < Math.min(5, job.data?.rows?.length || 0); i++) {
  console.log(i + 1, JSON.stringify(job.data.rows[i]));
}

console.log('\nLast 5 rows:');
const n = job.data?.rows?.length || 0;
for (let i = Math.max(0, n - 5); i < n; i++) {
  console.log(i + 1, JSON.stringify(job.data.rows[i]));
}
