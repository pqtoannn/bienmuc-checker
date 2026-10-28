import fs from 'fs';

const jobE = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19E.job.json', 'utf8'));

// Check for missing dates or missing soHieu
for (let i = 1; i < jobE.data.rows.length; i++) {
  const r = jobE.data.rows[i];
  const fn = r.sourceFileNames[0];
  if (!r.ngayThangVanBan || !r.soKyHieuVanBan || r.soKyHieuVanBan.includes('//') || !r.tacGiaVanBan) {
    console.log(`Alert row ${i} (${fn}): soHieu='${r.soKyHieuVanBan}', ngay='${r.ngayThangVanBan}', tacGia='${r.tacGiaVanBan}'`);
  }
}
