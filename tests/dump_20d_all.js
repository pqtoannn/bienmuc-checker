import fs from 'fs';

const j = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20D.job.json', 'utf8'));

console.log('Total rows:', j.data.rows.length);
// Print all rows with index, filename, soKyHieu, toSoTrangSo
const list = [];
j.data.rows.forEach((r, idx) => {
  list.push({
    idx: idx + 1,
    fn: r.sourceFileNames ? r.sourceFileNames[0] : '',
    so: r.soKyHieuVanBan || '',
    ngay: r.ngayThangVanBan || '',
    to: r.toSoTrangSo || '',
    trichYeu: (r.tenLoaiTrichYeu || '').substring(0, 30)
  });
});

fs.writeFileSync('tests/inspect_batch/PL_2020_20D/all_rows_summary.json', JSON.stringify(list, null, 2));
console.log('Saved all_rows_summary.json');
