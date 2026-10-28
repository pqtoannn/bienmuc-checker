import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20G.job.json', 'utf8'));
j.data.rows.forEach((r, idx) => {
  console.log(`${idx+1}: fn=${r.sourceFileNames[0]} | to=${r.toSoTrangSo} | so=${r.soKyHieuVanBan} | date=${r.ngayThangNamVanBan} | ty=${(r.trichYeuNoiDung||'').slice(0, 45)}`);
});
