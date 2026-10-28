import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// ==========================================
// 1. PROCESS PL_2021_21W
// ==========================================
async function process21W() {
  console.log('\n>>> PROCESSING PL_2021_21W...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21W.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 7 photos: 001.jpg to 007.jpg
  // 001.jpg is cover folder -> exclude
  // 002.jpg to 007.jpg: 6 active documents
  // Total sheets: 09 (01 to 09 continuous)

  const ranges = {
    2: '01',
    3: '02',
    4: '03',
    5: '04-06',
    6: '07',
    7: '08-09'
  };

  // Update job.images status
  job.images = [];
  for (let i = 1; i <= 7; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    job.images.push({
      fileName: fn,
      status: i === 1 ? 'skip' : 'active',
      isExcluded: i === 1
    });
  }

  const keys = [2, 3, 4, 5, 6, 7];
  const activeRows = [];
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const fn = String(p).padStart(3, '0') + '.jpg';
    const r = job.data.rows.find(row => row.sourceFileNames && row.sourceFileNames.includes(fn)) || job.data.rows[p - 1];

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: r.soKyHieuVanBan || '',
      ngayThangVanBan: r.ngayThangVanBan || '',
      tenLoaiTrichYeu: r.tenLoaiTrichYeu || '',
      tacGiaVanBan: r.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: ranges[p],
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: [fn]
    });
  }

  job.data.rows = activeRows;
  job.data.tenHoSo = 'Hồ sơ về công tác đạo đức công vụ, kỷ cương hành chính của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21W';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 19/01/2021 đến ngày 25/01/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 09 tờ`;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated PL_2021_21W.job.json with ${activeRows.length} rows`);

  const exportData21W = {
    ...job.data,
    rows: job.data.rows
  };

  const res1W = await exportJsonToExcel(exportData21W, path.join(DA_CHECK_DIR, 'PL_2021_21W.xlsx'));
  const res2W = await exportJsonToExcel(exportData21W, path.join(OUTPUT_OCR_DIR, 'PL_2021_21W.xlsx'));
  console.log('Exported 21W Da_check:', res1W);
  console.log('Exported 21W PL_outputOCR:', res2W);
}

// ==========================================
// 2. PROCESS PL_2021_21X
// ==========================================
async function process21X() {
  console.log('\n>>> PROCESSING PL_2021_21X...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21X.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 11 photos: 001.jpg to 011.jpg
  // 001.jpg is cover folder -> exclude
  // 002.jpg to 011.jpg: 10 active documents
  // Total sheets: 34 (01 to 34 continuous)

  const ranges = {
    2: '01-03',
    3: '04-05',
    4: '06-08',
    5: '09-11',
    6: '12-15',
    7: '16',
    8: '17-19',
    9: '20-21',
    10: '22-32',
    11: '33-34'
  };

  // Correct soKyHieu from visual inspection
  const soKyHieuMap = {
    7: '73/BC-UBND',
    8: '164/BC-UBND',
    9: '165/BC-UBND'
  };

  // Update job.images status
  job.images = [];
  for (let i = 1; i <= 11; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    job.images.push({
      fileName: fn,
      status: i === 1 ? 'skip' : 'active',
      isExcluded: i === 1
    });
  }

  const keys = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const activeRows = [];
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const fn = String(p).padStart(3, '0') + '.jpg';
    const r = job.data.rows.find(row => row.sourceFileNames && row.sourceFileNames.includes(fn)) || job.data.rows[p - 1];

    const soKyHieu = soKyHieuMap[p] || r.soKyHieuVanBan || '';

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: r.ngayThangVanBan || '',
      tenLoaiTrichYeu: r.tenLoaiTrichYeu || '',
      tacGiaVanBan: r.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: ranges[p],
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: [fn]
    });
  }

  job.data.rows = activeRows;
  job.data.tenHoSo = 'Hồ sơ đánh giá chính quyền cơ sở của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21X';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 17/05/2021 đến ngày 13/12/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 34 tờ`;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated PL_2021_21X.job.json with ${activeRows.length} rows`);

  const exportData21X = {
    ...job.data,
    rows: job.data.rows
  };

  const res1X = await exportJsonToExcel(exportData21X, path.join(DA_CHECK_DIR, 'PL_2021_21X.xlsx'));
  const res2X = await exportJsonToExcel(exportData21X, path.join(OUTPUT_OCR_DIR, 'PL_2021_21X.xlsx'));
  console.log('Exported 21X Da_check:', res1X);
  console.log('Exported 21X PL_outputOCR:', res2X);
}

async function main() {
  await process21W();
  await process21X();
  console.log('\n>>> BATCH 11 COMPLETE!');
}

main().catch(err => {
  console.error('Fatal error in batch 11:', err);
  process.exit(1);
});
