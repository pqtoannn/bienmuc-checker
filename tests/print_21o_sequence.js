import fs from 'fs';

const d = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2021_21o.job.json', 'utf8'));
const rows = d.data.rows;

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const fn = r.sourceFileNames ? r.sourceFileNames[0] : '';
  console.log(`${i}. [${fn}] So: "${r.soKyHieuVanBan}" | Ngay: "${r.ngayThangVanBan}" | TrichYeu: "${(r.tenLoaiTrichYeu || '').slice(0, 40)}"`);
}
