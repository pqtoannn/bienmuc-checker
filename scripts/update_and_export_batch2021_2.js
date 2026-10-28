import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// Helper to assign continuous sheet numbers
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
// 1. PROCESS PL_2021_21c
// ==========================================
async function process21c() {
  console.log('\n>>> PROCESSING PL_2021_21c...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21c.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const visualC = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 6, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 15, 12: 16, 13: 17, 14: 18, 15: 19,
    16: 20, 17: 21, 18: 22, 19: 24, 20: 25, 21: 26, 22: 27, 23: 29, 24: 31, 25: 32, 26: 34, 27: 35, 28: 36, 29: 37, 30: 38, 31: 39,
    32: 40, 33: 41, 34: 42, 35: 43, 36: 44, 37: 45, 38: 46, 39: 47, 40: 48, 41: 49, 42: 50, 43: 51, 44: 52, 45: 53, 46: 54, 47: 55,
    48: 56, 49: 57, 50: 58, 51: 59, 52: 60, 53: 61, 54: 62, 55: 63, 56: 64, 57: 65, 58: 66, 59: 67, 60: 68, 61: 69, 62: 70, 63: 71,
    64: 72, 65: 73, 66: 74, 67: 75, 68: 76, 69: 77, 70: 78, 71: 79, 72: 80, 73: 81, 74: 82, 75: 83, 76: 84, 77: 85, 78: 86, 79: 87,
    80: 92, 81: 93, 82: 95, 83: 98, 84: 101, 85: 102, 86: 103, 87: 104, 88: 105, 89: 107, 90: 108, 91: 109, 92: 111, 93: 112, 94: 113, 95: 116,
    96: 120, 97: 121, 98: 122, 99: 123, 100: 125, 101: 126, 102: 127, 103: 128, 104: 129, 105: 131, 106: 132, 107: 133, 108: 134, 109: 135, 110: 136, 111: 137,
    112: 138, 113: 139, 114: 140, 115: 141, 116: 142, 117: 143, 118: 144, 119: 145, 120: 146, 121: 147, 122: 149, 123: 150, 124: 151, 125: 153, 126: 154, 127: 155,
    128: 166, 129: 167, 130: 168, 131: 169, 132: 170, 133: 171, 134: 172, 135: 173, 136: 176, 137: 177, 138: 178, 139: 179, 140: 181, 141: 183, 142: 184, 143: 185,
    144: 186, 145: 187, 146: 188, 147: 189, 148: 190, 149: 191, 150: 192, 151: 193, 152: 194, 153: 195, 154: 196, 155: 197, 156: 198, 157: 199, 158: 200, 159: 201,
    160: 202, 161: 203, 162: 204, 163: 205, 164: 206, 165: 207, 166: 208, 167: 209, 168: 210, 169: 211, 170: 212, 171: 213, 172: 214, 173: 216, 174: 217
  };

  const starts = [null];
  let cur = 1;
  for (let i = 1; i <= 174; i++) {
    let val = visualC[i];
    if (val === undefined || val < cur) val = cur;
    const maxAllowed = 217 - (174 - i);
    if (val > maxAllowed) val = maxAllowed;
    starts.push(val);
    cur = val + 1;
  }

  const maxSheet = 217;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ thông báo đi của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21c';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 06/01/2021 đến ngày 30/12/2021';
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
    }
  });

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.name === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 217 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21c.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21c.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21c.xlsx'));
  console.log('Exported 21c Da_check:', res1);
  console.log('Exported 21c PL_outputOCR:', res2);
}

// ==========================================
// 2. PROCESS PL_2021_21d
// ==========================================
async function process21d() {
  console.log('\n>>> PROCESSING PL_2021_21d...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21d.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const visualD = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 6, 6: 7, 7: 8, 8: 9, 9: 11, 10: 12, 11: 14, 12: 16, 13: 17, 14: 19, 15: 20,
    16: 21, 17: 22, 18: 23, 19: 25, 20: 27, 21: 29, 22: 31, 23: 32, 24: 34, 25: 37, 26: 38, 27: 39, 28: 42, 29: 45, 30: 46, 31: 47,
    32: 52, 33: 53, 34: 54, 35: 57, 36: 58, 37: 60, 38: 61, 39: 63, 40: 64, 41: 66, 42: 68, 43: 70, 44: 71, 45: 73, 46: 74, 47: 75,
    48: 76, 49: 77, 50: 78, 51: 79, 52: 81, 53: 82, 54: 83, 55: 85, 56: 87, 57: 89, 58: 91, 59: 92, 60: 93, 61: 94, 62: 95, 63: 97,
    64: 99, 65: 101, 66: 103, 67: 105, 68: 106, 69: 107, 70: 109, 71: 111, 72: 112, 73: 113, 74: 114, 75: 115, 76: 116, 77: 118, 78: 120, 79: 122,
    80: 124, 81: 125, 82: 127, 83: 129, 84: 131, 85: 132, 86: 133, 87: 134, 88: 135, 89: 136, 90: 137, 91: 138, 92: 141, 93: 143, 94: 145, 95: 146,
    96: 148, 97: 150, 98: 152, 99: 153, 100: 154, 101: 155, 102: 157, 103: 158, 104: 160, 105: 162, 106: 163, 107: 164, 108: 165, 109: 166, 110: 167, 111: 168,
    112: 169, 113: 171, 114: 173, 115: 175, 116: 177, 117: 178, 118: 179, 119: 180, 120: 184, 121: 186, 122: 188, 123: 190, 124: 191, 125: 192, 126: 193, 127: 194,
    128: 195, 129: 197, 130: 199, 131: 200, 132: 201, 133: 202, 134: 203, 135: 204, 136: 206, 137: 208, 138: 210, 139: 211, 140: 213, 141: 214, 142: 215, 143: 216,
    144: 217, 145: 218, 146: 219, 147: 220, 148: 221, 149: 222, 150: 223
  };

  const starts = [null];
  let cur = 1;
  for (let i = 1; i <= 150; i++) {
    let val = visualD[i];
    if (val === undefined || val < cur) val = cur;
    const maxAllowed = 223 - (150 - i);
    if (val > maxAllowed) val = maxAllowed;
    starts.push(val);
    cur = val + 1;
  }

  const maxSheet = 223;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ tờ trình đi của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21d';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 04/01/2021 đến ngày 28/12/2021';
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
    }
  });

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.name === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 223 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21d.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21d.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21d.xlsx'));
  console.log('Exported 21d Da_check:', res1);
  console.log('Exported 21d PL_outputOCR:', res2);
}

// ==========================================
// 3. PROCESS PL_2021_21e
// ==========================================
async function process21e() {
  console.log('\n>>> PROCESSING PL_2021_21e...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21e.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const visualE = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 10, 10: 11, 11: 13, 12: 15, 13: 16, 14: 17, 15: 19,
    16: 21, 17: 22, 18: 24, 19: 27, 20: 29, 21: 30, 22: 31, 23: 33, 24: 35, 25: 37, 26: 39, 27: 41, 28: 44, 29: 46, 30: 48, 31: 60
  };

  const starts = [null];
  let cur = 1;
  for (let i = 1; i <= 31; i++) {
    let val = visualE[i];
    if (val === undefined || val < cur) val = cur;
    const maxAllowed = 60 - (31 - i);
    if (val > maxAllowed) val = maxAllowed;
    starts.push(val);
    cur = val + 1;
  }

  const maxSheet = 60;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ danh sách các loại của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21e';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 01/01/2021 đến ngày 15/12/2021';
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
    }
  });

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.name === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 60 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21e.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21e.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21e.xlsx'));
  console.log('Exported 21e Da_check:', res1);
  console.log('Exported 21e PL_outputOCR:', res2);
}

async function run() {
  await process21c();
  await process21d();
  await process21e();
  console.log('\n=== ALL BATCH 2 (2021) DOSSIERS SUCCESSFULLY PROCESSED ===');
}

run().catch(err => {
  console.error('Error running batch 2 2021:', err);
  process.exit(1);
});
