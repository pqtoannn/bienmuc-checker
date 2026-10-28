import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// Helper to assign continuous sheet ranges
function computeSheetRanges(starts, maxSheet) {
  const result = new Array(starts.length).fill('');
  for (let idx = 0; idx < starts.length; idx++) {
    const s = starts[idx];
    if (s === null || s === undefined) continue;

    let e = maxSheet;
    for (let next = idx + 1; next < starts.length; next++) {
      if (typeof starts[next] === 'number') {
        e = starts[next] - 1;
        break;
      }
    }
    result[idx] = (s === e) ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')}-${String(e).padStart(2, '0')}`;
  }
  return result;
}

// ==========================================
// 1. PROCESS PL_2021_21i
// ==========================================
async function process21i() {
  console.log('\n>>> PROCESSING PL_2021_21i...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21i.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 143 photos: idx 0 is cover (001.jpg)
  // 142 active documents: idx 1 to 142
  // Multi-page documents:
  // idx 46 (047.jpg): 46-47
  // idx 65 (066.jpg): 66-67
  // idx 73 (074.jpg): 75-76
  // idx 89 (090.jpg): 92-95
  // idx 90 (091.jpg): 96-99
  // idx 91 (092.jpg): 100-101
  // idx 92 (093.jpg): 102-103
  // idx 93 (094.jpg): 104-106
  // idx 112 (113.jpg): 125-128
  // idx 120 (121.jpg): 136-137

  const starts = [null]; // idx 0 is cover
  let curSheet = 1;

  for (let idx = 1; idx <= 142; idx++) {
    starts.push(curSheet);
    let pageCount = 1;
    if (idx === 46) pageCount = 2; // 047.jpg: 46-47
    else if (idx === 65) pageCount = 2; // 066.jpg: 66-67
    else if (idx === 73) pageCount = 2; // 074.jpg: 75-76
    else if (idx === 89) pageCount = 4; // 090.jpg: 92-95
    else if (idx === 90) pageCount = 4; // 091.jpg: 96-99
    else if (idx === 91) pageCount = 2; // 092.jpg: 100-101
    else if (idx === 92) pageCount = 2; // 093.jpg: 102-103
    else if (idx === 93) pageCount = 3; // 094.jpg: 104-106
    else if (idx === 112) pageCount = 4; // 113.jpg: 125-128
    else if (idx === 120) pageCount = 2; // 121.jpg: 136-137

    curSheet += pageCount;
  }

  const maxSheet = 159;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ quyết định đi (tháng 10 quý IV) của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21i';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 01/10/2021 đến ngày 31/10/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.data.rowsTrung = [];

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else {
      img.isExcluded = false;
      img.status = 'active';
      row.toSoTrangSo = sheetRanges[idx];
      row.loaiBan = 'Bản gốc';
      row.tacGiaVanBan = 'Ủy ban nhân dân xã Phú Lộc';

      // Clean up common OCR typos in số hiệu
      if (row.soKyHieuVanBan) {
        row.soKyHieuVanBan = row.soKyHieuVanBan.replace(/O/g, '0').trim();
      }
    }
  });

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.fileName === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 159 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21i.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21i.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21i.xlsx'));
  console.log('Exported 21i Da_check:', res1);
  console.log('Exported 21i PL_outputOCR:', res2);
}

// ==========================================
// 2. PROCESS PL_2021_21j
// ==========================================
async function process21j() {
  console.log('\n>>> PROCESSING PL_2021_21j...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21j.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 188 photos: idx 0 is cover (001.jpg)
  // 187 active documents: idx 1 to 187
  // Multi-page documents:
  // idx 12 (013.jpg): 12-13
  // idx 24 (025.jpg): 25-26
  // idx 43 (044.jpg): 45-46
  // idx 110 (111.jpg): 113-114
  // idx 155 (156.jpg): 159-160

  const starts = [null]; // idx 0 is cover
  let curSheet = 1;

  for (let idx = 1; idx <= 187; idx++) {
    starts.push(curSheet);
    let pageCount = 1;
    if (idx === 12) pageCount = 2; // 013.jpg: 12-13
    else if (idx === 24) pageCount = 2; // 025.jpg: 25-26
    else if (idx === 43) pageCount = 2; // 044.jpg: 45-46
    else if (idx === 110) pageCount = 2; // 111.jpg: 113-114
    else if (idx === 155) pageCount = 2; // 156.jpg: 159-160

    curSheet += pageCount;
  }

  const maxSheet = 192;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ quyết định đi (từ ngày 01/12 đến ngày 15/12) của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21j';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 01/12/2021 đến ngày 15/12/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.data.rowsTrung = [];

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else {
      img.isExcluded = false;
      img.status = 'active';
      row.toSoTrangSo = sheetRanges[idx];
      row.loaiBan = 'Bản gốc';
      row.tacGiaVanBan = 'Ủy ban nhân dân xã Phú Lộc';

      // Clean up common OCR typos in số hiệu
      if (row.soKyHieuVanBan) {
        row.soKyHieuVanBan = row.soKyHieuVanBan.replace(/O/g, '0').trim();
      }
    }
  });

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.fileName === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 192 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21j.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21j.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21j.xlsx'));
  console.log('Exported 21j Da_check:', res1);
  console.log('Exported 21j PL_outputOCR:', res2);
}

async function run() {
  await process21i();
  await process21j();
  console.log('\n=== ALL BATCH 4 (2021) DOSSIERS SUCCESSFULLY PROCESSED ===');
}

run().catch(err => {
  console.error('Error running batch 4 2021:', err);
  process.exit(1);
});
