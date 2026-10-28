import fs from 'fs';

const job = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2021_21T.job.json', 'utf8'));
job.data.rows.forEach((r, idx) => {
  const fn = r.sourceFileNames ? r.sourceFileNames.join(',') : 'none';
  const so = r.soKyHieuVanBan || '-';
  const ngay = r.ngayThangVanBan || '-';
  const toSo = r.toSoTrangSo || '-';
  const ty = (r.tenLoaiTrichYeu || '').substring(0, 60);
  console.log(`[${idx + 1}] ${fn} -> so: ${so} | ngay: ${ngay} | toSo: ${toSo} | ${ty}`);
});
