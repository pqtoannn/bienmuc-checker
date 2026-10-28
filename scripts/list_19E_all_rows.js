import fs from 'fs';

const jobE = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19E.job.json', 'utf8'));

console.log('--- ALL ROWS IN 19E ---');
jobE.data.rows.forEach((r, idx) => {
  const fn = r.sourceFileNames ? r.sourceFileNames[0] : '';
  console.log(`[${idx}] ${fn} | So: ${r.soKyHieuVanBan} | Ngay: ${r.ngayThangVanBan} | TacGia: ${r.tacGiaVanBan} | TrichYeu: ${r.tenLoaiTrichYeu ? r.tenLoaiTrichYeu.slice(0, 40) : ''}`);
});
