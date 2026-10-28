import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20M.job.json', 'utf8'));

for (let i = 1; i <= 23; i++) {
  const r = j.data.rows[i];
  console.log(`${i}: fn=${r.sourceFileNames[0]} | to=${r.toSoTrangSo} | so=${r.soKyHieuVanBan} | date=${r.ngayThangVanBan} | tacGia=${r.tacGiaVanBan} | ty=${(r.tenLoaiTrichYeu||'').slice(0, 45)}`);
}
