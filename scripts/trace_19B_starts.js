import fs from 'fs';
import path from 'path';

const jobPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19B.job.json';
const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

const rows = job.data?.rows || [];
console.log(`Loaded ${rows.length} rows from 19B job.`);

const report = rows.map((r, i) => {
  return {
    index: i + 1,
    fn: r.sourceFileNames ? r.sourceFileNames[0] : `00${i+1}.jpg`,
    soKyHieu: r.soKyHieuVanBan,
    ngay: r.ngayThangVanBan,
    toSoOCR: r.toSoTrangSo,
    trichYeu: (r.tenLoaiTrichYeu || '').slice(0, 45),
    loaiBan: r.loaiBan
  };
});

for (let i = 0; i < report.length; i += 10) {
  console.log(`\n--- Items ${i + 1} to ${Math.min(i + 10, report.length)} ---`);
  for (let j = i; j < Math.min(i + 10, report.length); j++) {
    const item = report[j];
    console.log(`${String(item.index).padStart(3, ' ')} | ${item.fn} | toSo: ${item.toSoOCR.padStart(3, ' ')} | ${item.soKyHieu.padEnd(16, ' ')} | ${item.trichYeu}`);
  }
}
