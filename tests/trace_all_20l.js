import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20L.job.json', 'utf8'));

// Photo 1 is cover (skip).
// Photo 102 is closing page of 101 (skip, ends at 266).
// Active docs: 002 to 101 (100 active docs).
const rows = j.data.rows;
for (let i = 1; i <= 100; i++) { // photos 2 to 101
  const r = rows[i];
  console.log(`${r.sourceFileNames[0]}: toSo=${r.toSoTrangSo} | so=${r.soKyHieuVanBan}`);
}
