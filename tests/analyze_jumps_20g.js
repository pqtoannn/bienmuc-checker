import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20G.job.json', 'utf8'));

let lastNum = 0;
j.data.rows.forEach((r, idx) => {
  if (idx === 0) return; // skip cover
  const num = parseInt(r.toSoTrangSo, 10);
  const diff = num - lastNum;
  if (isNaN(num) || diff <= 0 || diff > 4) {
    console.log(`Row ${idx+1} (${r.sourceFileNames[0]}): prev=${lastNum} -> curr=${r.toSoTrangSo} (diff=${diff}) | so=${r.soKyHieuVanBan}`);
  }
  if (!isNaN(num) && num < 300) {
    lastNum = num;
  }
});
