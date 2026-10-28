import fs from 'fs';
const job = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2016_16B.job.json', 'utf8'));
const rows = job.data?.rows || [];
console.log('Total job.images:', job.images?.length, 'Total job.data.rows:', rows.length);
rows.forEach((r, idx) => {
  const img = job.images ? job.images[idx] : '';
  console.log(`${idx}: img=${img} | so=${r.soKyHieu} | ngay=${r.ngayThang} | toSo=${r.toSoTrangSo} | trichYeu=${(r.tenLoaiTrichYeu||'').slice(0, 35)}`);
});
