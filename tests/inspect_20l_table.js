import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20L.job.json', 'utf8'));

console.log('20L total rows in job:', j.data.rows.length);
j.data.rows.forEach((r, idx) => {
  console.log(`${idx+1}: fn=${r.sourceFileNames[0]} | to=${r.toSoTrangSo} | so=${r.soKyHieuVanBan} | date=${r.ngayThangVanBan} | ty=${(r.tenLoaiTrichYeu||'').slice(0, 45)}`);
});
