import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20J.job.json', 'utf8'));
console.log('Original 20J rows:');
j.data.rows.forEach((r, idx) => {
  console.log(`Row ${idx}: fn=${r.sourceFileNames} | to=${r.toSoTrangSo} | so=${r.soKyHieuVanBan} | ty=${r.tenLoaiTrichYeu}`);
});
