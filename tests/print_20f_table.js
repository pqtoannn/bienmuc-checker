import fs from 'fs';

// Let's inspect the progression of toSoTrangSo in PL_2020_20F.job.json
const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20F.job.json', 'utf8'));

console.log('Index | Photo | So | Ngay | OCR_To | TrichYeu');
j.data.rows.forEach((r, idx) => {
  const p = idx + 1;
  const fn = r.sourceFileNames ? r.sourceFileNames[0] : '';
  console.log(`${String(p).padStart(3, ' ')} | ${fn} | ${(r.soKyHieuVanBan||'').padEnd(15, ' ')} | ${(r.ngayThangVanBan||'').padEnd(10, ' ')} | ${(r.toSoTrangSo||'').padEnd(6, ' ')} | ${(r.tenLoaiTrichYeu||'').substring(0, 30)}`);
});
