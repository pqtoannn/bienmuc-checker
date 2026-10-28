import fs from 'fs';

const jD = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20D.job.json', 'utf8'));

console.log('Total rows in job:', jD.data.rows.length);
// Let's inspect rows with empty or weird toSoTrangSo
jD.data.rows.forEach((r, idx) => {
  const p = idx + 1;
  const to = r.toSoTrangSo || '';
  const num = parseInt(to, 10);
  if (!to || isNaN(num) || num > 350) {
    console.log(`Row ${p} (${r.sourceFileNames ? r.sourceFileNames[0] : ''}): to="${to}" | so="${r.soKyHieuVanBan}" | trichYeu="${(r.tenLoaiTrichYeu||'').substring(0,40)}"`);
  }
});
