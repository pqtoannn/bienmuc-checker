import fs from 'fs';

const jD = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20D.job.json', 'utf8'));

console.log('=== Checking 20D sequence ===');
const rows = jD.data.rows;
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const fn = r.sourceFileNames ? r.sourceFileNames[0] : '';
  console.log(`[${i}] ${fn} | OCR to: ${r.toSoTrangSo} | So: ${r.soKyHieuVanBan} | Ngay: ${r.ngayThangVanBan} | TrichYeu: ${(r.tenLoaiTrichYeu || '').substring(0, 50)}`);
}
