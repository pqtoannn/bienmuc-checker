import fs from 'fs';

const d = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2021_21o.job.json', 'utf8'));
const rows = d.data.rows;

const numbers = [];
rows.forEach((r, idx) => {
  const fn = r.sourceFileNames ? r.sourceFileNames[0] : ('row_' + idx);
  const toSo = (r.toSoTrangSo || '').trim();
  const num = parseInt(toSo, 10);
  numbers.push({ idx, fn, toSo, num });
});

console.log('Sample toSo values:');
console.log(numbers.slice(0, 20));
console.log(numbers.slice(190));
