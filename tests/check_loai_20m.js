import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20M.job.json', 'utf8'));
console.log('Checking 20M:');
j.data.rows.forEach((r, idx) => {
  if (r.loaiBan && (r.loaiBan.toLowerCase().includes('trùng') || r.loaiBan.toLowerCase().includes('photo') || r.loaiBan.toLowerCase().includes('bản sao'))) {
    console.log(`  Row ${idx+1} (${r.sourceFileNames[0]}): loaiBan=${r.loaiBan}, so=${r.soKyHieuVanBan}`);
  }
});
