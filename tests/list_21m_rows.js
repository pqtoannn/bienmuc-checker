import fs from 'fs';

const d = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2021_21m.job.json', 'utf8'));
const rows = d.data.rows;

for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  const fn = r.sourceFileNames ? r.sourceFileNames[0] : ('row_' + i);
  console.log((i + 1) + '. [' + fn + '] So: "' + (r.soKyHieuVanBan || '') + '" | Ngay: "' + (r.ngayThangVanBan || '') + '" | ToSo: "' + (r.toSoTrangSo || '') + '" | Loai: "' + (r.loaiBan || '') + '" | GhiChu: "' + (r.ghiChu || '') + '"');
}
