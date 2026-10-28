import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// ==========================================
// 1. PROCESS PL_2021_21U
// ==========================================
async function process21U() {
  console.log('\n>>> PROCESSING PL_2021_21U...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21U.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 57 photos: 001.jpg to 057.jpg
  // 001.jpg is cover note -> exclude
  // 002.jpg to 057.jpg: 56 active documents
  // Total sheets: 198 (01 to 198 continuous)

  const starts = {
    2: 1, 3: 14, 4: 17, 5: 18, 6: 19, 7: 20, 8: 21, 9: 35, 10: 38,
    11: 40, 12: 43, 13: 45, 14: 48, 15: 51, 16: 54, 17: 61, 18: 62, 19: 70, 20: 75,
    21: 77, 22: 80, 23: 83, 24: 86, 25: 89, 26: 92, 27: 100, 28: 103, 29: 112, 30: 122,
    31: 124, 32: 127, 33: 130, 34: 134, 35: 138, 36: 142, 37: 146, 38: 149, 39: 152, 40: 156,
    41: 159, 42: 162, 43: 165, 44: 168, 45: 169, 46: 170, 47: 172, 48: 173, 49: 175, 50: 178,
    51: 181, 52: 184, 53: 186, 54: 189, 55: 192, 56: 195, 57: 198
  };

  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
  const ranges = {};

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const startNum = starts[p];
    let endNum;
    if (i === keys.length - 1) {
      endNum = 198;
    } else {
      endNum = starts[keys[i + 1]] - 1;
    }
    
    if (startNum === endNum) {
      ranges[p] = String(startNum).padStart(2, '0');
    } else {
      ranges[p] = `${String(startNum).padStart(2, '0')}-${String(endNum).padStart(2, '0')}`;
    }
  }

  // Update job.images status
  job.images = [];
  for (let i = 1; i <= 57; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    job.images.push({
      fileName: fn,
      status: i === 1 ? 'skip' : 'active',
      isExcluded: i === 1
    });
  }

  // Map active rows from job.data.rows
  const activeRows = [];
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const fn = String(p).padStart(3, '0') + '.jpg';
    const r = job.data.rows.find(row => row.sourceFileNames && row.sourceFileNames.includes(fn)) || job.data.rows[p - 1];

    let ngay = r.ngayThangVanBan || '';
    if (p === 44 && ngay === '30/10/2023') {
      ngay = '30/10/2021'; // OCR error corrected from scan
    }

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: r.soKyHieuVanBan || '',
      ngayThangVanBan: ngay,
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
  job.data.tenHoSo = 'Hồ sơ về việc đánh giá, xếp loại cán bộ, công chức của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21U';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 15/01/2021 đến ngày 01/12/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 198 tờ`;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated PL_2021_21U.job.json with ${activeRows.length} rows`);

  const exportData21U = {
    ...job.data,
    rows: job.data.rows
  };

  const res1U = await exportJsonToExcel(exportData21U, path.join(DA_CHECK_DIR, 'PL_2021_21U.xlsx'));
  const res2U = await exportJsonToExcel(exportData21U, path.join(OUTPUT_OCR_DIR, 'PL_2021_21U.xlsx'));
  console.log('Exported 21U Da_check:', res1U);
  console.log('Exported 21U PL_outputOCR:', res2U);
}

// ==========================================
// 2. PROCESS PL_2021_21V
// ==========================================
async function process21V() {
  console.log('\n>>> PROCESSING PL_2021_21V...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21V.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 7 photos: 001.jpg to 007.jpg
  // 001.jpg is cover note -> exclude
  // 002.jpg to 006.jpg: active docs (007 is closing sheet of 006)
  // Total active documents: 5
  // Total sheets: 23 (01 to 23 continuous)

  const starts = {
    2: 1,  // 10/KH-UBND (01-03)
    3: 4,  // 02/2021/QĐ-UBND (04-10)
    4: 11, // 33-QĐ/ĐU (11)
    5: 12, // 02/KH-CAX (12-17)
    6: 18  // 39-NQ/ĐU (18-23, merged with 007.jpg)
  };

  const ranges = {
    2: '01-03',
    3: '04-10',
    4: '11',
    5: '12-17',
    6: '18-23'
  };

  // Update job.images status
  job.images = [];
  for (let i = 1; i <= 7; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    job.images.push({
      fileName: fn,
      status: (i === 1 || i === 7) ? 'skip' : 'active',
      isExcluded: (i === 1 || i === 7)
    });
  }

  const keys = [2, 3, 4, 5, 6];
  const activeRows = [];
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const fn = String(p).padStart(3, '0') + '.jpg';
    const r = job.data.rows.find(row => row.sourceFileNames && row.sourceFileNames.includes(fn)) || job.data.rows[p - 1];
    const isDoc6 = (p === 6);
    const sourceFiles = isDoc6 ? ['006.jpg', '007.jpg'] : [fn];

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
      sourceFileNames: sourceFiles
    });
  }

  job.data.rows = activeRows;
  job.data.tenHoSo = 'Hồ sơ về công tác xây dựng chính quyền cơ sở của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21V';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 25/01/2021 đến ngày 20/12/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 23 tờ`;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated PL_2021_21V.job.json with ${activeRows.length} rows`);

  const exportData21V = {
    ...job.data,
    rows: job.data.rows
  };

  const res1V = await exportJsonToExcel(exportData21V, path.join(DA_CHECK_DIR, 'PL_2021_21V.xlsx'));
  const res2V = await exportJsonToExcel(exportData21V, path.join(OUTPUT_OCR_DIR, 'PL_2021_21V.xlsx'));
  console.log('Exported 21V Da_check:', res1V);
  console.log('Exported 21V PL_outputOCR:', res2V);
}

async function main() {
  await process21U();
  await process21V();
  console.log('\n>>> BATCH 10 COMPLETE!');
}

main().catch(err => {
  console.error('Fatal error in batch 10:', err);
  process.exit(1);
});
