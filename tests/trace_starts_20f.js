import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20F.job.json', 'utf8'));

// Skips: 1 (cover), 58 (dup 57), 121 (dup 120), 151 (closing page)
// Let's inspect the progression for each photo from 2 to 150:
const rows = j.data.rows;
for (let p = 2; p <= 150; p++) {
  if (p === 58 || p === 121) continue;
  const r = rows[p - 1];
  console.log(`${p}: fn=${r.sourceFileNames[0]} | so=${r.soKyHieuVanBan} | to=${r.toSoTrangSo}`);
}
