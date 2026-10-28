import fs from 'fs';

const jobI = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19I.job.json', 'utf8'));

console.log('Total rows:', jobI.data.rows.length);
for (let i = 0; i < jobI.data.rows.length; i++) {
  const r = jobI.data.rows[i];
  const fn = r.sourceFileNames ? r.sourceFileNames[0] : '';
  console.log(`[${i}] ${fn} | ToSo: '${r.toSoTrangSo || ''}' | So: '${r.soKyHieuVanBan || ''}' | Ngay: '${r.ngayThangVanBan || ''}' | TrichYeu: ${(r.tenLoaiTrichYeu || '').slice(0, 40)}`);
}
