import fs from 'fs';

const d = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2021_21n.job.json', 'utf8'));
const rows = d.data.rows;

// check duplicates in rows
const seen = new Map();
rows.forEach((r, idx) => {
  if (idx === 0) return; // skip cover
  const num = (r.soKyHieuVanBan || '').trim().toLowerCase();
  if (num) {
    if (seen.has(num)) {
      console.log(`Duplicate number found: "${num}" at row ${seen.get(num)} and row ${idx + 1}`);
    } else {
      seen.set(num, idx + 1);
    }
  }
});
