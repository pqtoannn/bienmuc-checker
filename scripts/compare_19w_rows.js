import fs from 'fs';
import xlsxMod from 'xlsx';
const xlsx = xlsxMod.default || xlsxMod;

const job = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19W.job.json', 'utf8'));
const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2019_19W.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const excelRows = xlsx.utils.sheet_to_json(ws, { header: 1 });

console.log('=== Comparing PL_2019_19W Job vs Raw Excel ===');
console.log('Job rows count:', job.data.rows.length);
console.log('Job images count:', job.images.length);

const jobRows = job.data.rows;
for (let i = 0; i < jobRows.length; i++) {
  const r = jobRows[i];
  const ex = excelRows[i + 5] || [];
  console.log(`[#${String(i + 1).padStart(2)}] Files: ${r.sourceFileNames?.join(',') || 'none'} | JobTo: '${r.toSoTrangSo}' | ExTo: '${ex[5] || ''}' | So: '${r.soKyHieuVanBan || ex[1] || ''}' | Ngay: '${r.ngayThangVanBan || ex[2] || ''}' | Loai: '${r.loaiBan || ex[6] || ''}'`);
}
