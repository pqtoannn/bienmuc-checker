import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20D.job.json', 'utf8'));

console.log('Index | File | SoHieu | Ngay | OCR_To | TrichYeu');
for (let i = 170; i <= 225; i++) {
  const r = j.data.rows[i - 1];
  console.log(`${i} | ${r.sourceFileNames[0]} | ${r.soKyHieuVanBan} | ${r.ngayThangVanBan} | ${r.toSoTrangSo} | ${(r.tenLoaiTrichYeu||'').substring(0, 30)}`);
}
