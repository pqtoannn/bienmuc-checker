import fs from 'fs';

const d = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2021_21o.job.json', 'utf8'));
const rows = d.data.rows;

console.log('Total rows:', rows.length);
let twoPageCandidates = [];
rows.forEach((r, idx) => {
  const fn = r.sourceFileNames ? r.sourceFileNames[0] : ('row_' + idx);
  const toSo = (r.toSoTrangSo || '').trim();
  if (toSo.includes('-')) {
    twoPageCandidates.push({ idx, fn, toSo, so: r.soKyHieuVanBan, ngay: r.ngayThangVanBan });
  }
});

console.log('Detected multi-page rows in OCR:', twoPageCandidates.length);
console.log(twoPageCandidates);
