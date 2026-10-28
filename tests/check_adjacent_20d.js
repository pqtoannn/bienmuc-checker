import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20D.job.json', 'utf8'));

// Check for any other adjacent rows with identical soKyHieu or identical title
const rows = j.data.rows;
for (let i = 0; i < rows.length - 1; i++) {
  const r1 = rows[i];
  const r2 = rows[i + 1];
  if (r1.soKyHieuVanBan && r2.soKyHieuVanBan && r1.soKyHieuVanBan === r2.soKyHieuVanBan) {
    console.log(`Adjacent same so: ${i+1} (${r1.sourceFileNames[0]}) & ${i+2} (${r2.sourceFileNames[0]}): so=${r1.soKyHieuVanBan}`);
  }
}
