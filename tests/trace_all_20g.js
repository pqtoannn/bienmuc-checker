import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20G.job.json', 'utf8'));

// Photo 1 is cover (skip).
// Photo 106 is closing page of 105 (skip/merged into 105).
// Let's print each photo's extracted toSoTrangSo and detected info:
const rows = j.data.rows;
for (let i = 1; i <= 104; i++) { // photos 2 to 105 (indices 1 to 104)
  const r = rows[i];
  console.log(`${r.sourceFileNames[0]}: toSo=${r.toSoTrangSo} | so=${r.soKyHieuVanBan}`);
}
