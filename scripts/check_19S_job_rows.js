import fs from 'fs';

const job = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19S.job.json', 'utf8'));

console.log(`=== CHECKING 19S ROWS (${job.data.rows.length}) ===`);
job.data.rows.forEach((r, idx) => {
  if (idx === 0) {
    console.log(`[0] Photo ${r.sourceFileNames} (Cover): '${r.tenLoaiTrichYeu}'`);
  } else {
    console.log(`[${idx}] Photo ${r.sourceFileNames} | Số: '${r.soKyHieuVanBan || ''}' | Ngày: '${r.ngayThangVanBan || ''}' | Tác giả: '${r.tacGiaVanBan || ''}' | Trích yếu: '${(r.tenLoaiTrichYeu || '').slice(0, 50)}'`);
  }
});
