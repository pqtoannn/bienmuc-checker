import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20D.job.json', 'utf8'));

console.log('--- ALL ROWS 1 TO 225 ---');
for (let i = 1; i <= 225; i++) {
  const r = j.data.rows[i - 1];
  console.log(`${String(i).padStart(3, ' ')}: file=${r.sourceFileNames[0]} | so=${(r.soKyHieuVanBan||'').padEnd(15, ' ')} | to=${(r.toSoTrangSo||'').padEnd(8, ' ')} | ngay=${(r.ngayThangVanBan||'').padEnd(10, ' ')} | trichYeu=${(r.tenLoaiTrichYeu||'').substring(0, 35)}`);
}
