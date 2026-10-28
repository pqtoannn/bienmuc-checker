import fs from 'fs';

const job = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19R.job.json', 'utf8'));

// Rows 1 to 33 correspond to photos 002.jpg to 034.jpg (job.data.rows[1] to [33])
console.log('=== CHECKING METADATA OF ROWS 1 TO 33 ===');
for (let i = 1; i <= 33; i++) {
  const r = job.data.rows[i];
  console.log(`[STT ${i}] Photo: ${r.sourceFileNames} | Số: '${r.soKyHieuVanBan || ''}' | Ngày: '${r.ngayThangVanBan || ''}' | Tác giả: '${r.tacGiaVanBan || ''}' | Trích yếu: '${r.tenLoaiTrichYeu}'`);
}
