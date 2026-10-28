import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20D';
const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20D.job.json', 'utf8'));

// Check rows with identical soKyHieu and ngayThang
const rows = j.data.rows;
for (let i = 0; i < rows.length; i++) {
  for (let k = i + 1; k < rows.length; k++) {
    const r1 = rows[i];
    const r2 = rows[k];
    if (r1.soKyHieuVanBan && r2.soKyHieuVanBan &&
        r1.soKyHieuVanBan === r2.soKyHieuVanBan &&
        r1.ngayThangVanBan === r2.ngayThangVanBan) {
      console.log(`Duplicate so & ngay: row ${i+1} (${r1.sourceFileNames[0]}) and row ${k+1} (${r2.sourceFileNames[0]}): so=${r1.soKyHieuVanBan}, to1=${r1.toSoTrangSo}, to2=${r2.toSoTrangSo}`);
    }
  }
}
