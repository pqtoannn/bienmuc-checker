import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20H.job.json', 'utf8'));

// Photo 1 is cover (skip).
// Photos 2 to 79:
const rows = j.data.rows;
for (let i = 1; i <= 78; i++) { // photos 2 to 79 (indices 1 to 78)
  const r = rows[i];
  console.log(`${r.sourceFileNames[0]}: toSo=${r.toSoTrangSo} | so=${r.soKyHieuVanBan}`);
}
