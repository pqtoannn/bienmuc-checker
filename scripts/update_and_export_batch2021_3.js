import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

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
// 1. PROCESS PL_2021_21f
// ==========================================
async function process21f() {
  console.log('\n>>> PROCESSING PL_2021_21f...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21f.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const visualF = {
    1: 1, 2: 5, 3: 9, 4: 10, 5: 21, 6: 24, 7: 25, 8: 27, 9: 29, 10: 38, 11: 41, 12: 42, 13: 46, 14: 49, 15: 50,
    16: 51, 17: 52, 18: 54, 19: 55, 20: 56, 21: 59, 22: 61, 23: 64, 24: 66, 25: 70, 26: 73, 27: 74, 28: 75, 29: 76, 30: 78, 31: 82,
    32: 86, 33: 87, 34: 88, 35: 91, 36: 96, 37: 97, 38: 99, 39: 102, 40: 105, 41: 110, 42: 116, 43: 118, 44: 120, 45: 121, 46: 122, 47: 123,
    48: 124, 49: 127, 50: 131, 51: 133, 52: 134, 53: 135, 54: 138, 55: 139, 56: 140, 57: 144, 58: 152, 59: 154, 60: 155, 61: 159, 62: 160, 63: 165,
    64: 166, 65: 170, 66: 171, 67: 172, 68: 174, 69: 179, 70: 182, 71: 185, 72: 186, 73: 187
  };
  const starts = [null];
  let curF = 1;
  for (let i = 1; i <= 73; i++) {
    let val = visualF[i];
    if (val === undefined || val < curF) val = curF;
    const maxAllowed = 187 - (73 - i);
    if (val > maxAllowed) val = maxAllowed;
    starts.push(val);
    curF = val + 1;
  }

  const maxSheet = 187;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ báo cáo đi (tập 1 quý I và II) của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21f';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 02/01/2021 đến ngày 23/12/2021';
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

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 187 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21f.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21f.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21f.xlsx'));
  console.log('Exported 21f Da_check:', res1);
  console.log('Exported 21f PL_outputOCR:', res2);
}

// ==========================================
// 2. PROCESS PL_2021_21g
// ==========================================
async function process21g() {
  console.log('\n>>> PROCESSING PL_2021_21g...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21g.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const visualG = {
    1: 1, 2: 2, 3: 4, 4: 5, 5: 6, 6: 9, 7: 13, 8: 14, 9: 15, 10: 16, 11: 17, 12: 19, 13: 20, 14: 21, 15: 23,
    16: 24, 17: 28, 18: 29, 19: 32, 20: 33, 21: 34, 22: 35, 23: 36, 24: 37, 25: 38, 26: 39, 27: 41, 28: 43, 29: 45, 30: 52, 31: 53,
    32: 54, 33: 56, 34: 59, 35: 61, 36: 62, 37: 69, 38: 74, 39: 80, 40: 81, 41: 82, 42: 83, 43: 84, 44: 86, 45: 87, 46: 88, 47: 89,
    48: 90, 49: 96, 50: 97, 51: 98, 52: 99, 53: 101, 54: 102, 55: 105, 56: 108, 57: 112, 58: 113, 59: 116, 60: 120, 61: 123, 62: 124, 63: 131,
    64: 132, 65: 133, 66: 134, 67: 137, 68: 139, 69: 140, 70: 142, 71: 143, 72: 144, 73: 150, 74: 152, 75: 154, 76: 156, 77: 161, 78: 164, 79: 167,
    80: 170, 81: 179, 82: 182, 83: 183, 84: 187, 85: 193, 86: 198, 87: 200, 88: 202, 89: 204, 90: 205, 91: 206, 92: 208, 93: 212, 94: 215, 95: 216,
    96: 218, 97: 221, 98: 222, 99: 223, 100: 224, 101: 225, 102: 226, 103: 227, 104: 228, 105: 229, 106: 230, 107: 231, 108: 232, 109: 233, 110: 234, 111: 235,
    112: 236, 113: 238, 114: 240, 115: 242, 116: 245, 117: 248, 118: 250, 119: 253, 120: 256, 121: 260, 122: 264, 123: 268, 124: 271, 125: 274
  };

  const starts = [null];
  let curG = 1;
  for (let i = 1; i <= 125; i++) {
    let val = visualG[i];
    if (val === undefined || val < curG) val = curG;
    const maxAllowed = 274 - (125 - i);
    if (val > maxAllowed) val = maxAllowed;
    starts.push(val);
    curG = val + 1;
  }
  starts.push(null); // idx 126 is 127.jpg (Photo)

  const maxSheet = 274;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ báo cáo đi (tập 2 quý III và IV) của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21g';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 02/07/2021 đến ngày 23/12/2021';
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
    } else if (idx === 126) {
      // 127.jpg: marked "photo" at top right
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '275-276';
      row.ghiChu = 'Photo';
      row.loaiBan = 'Photo';
      job.data.rowsTrung.push({ ...row });
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

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 274 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21g.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21g.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21g.xlsx'));
  console.log('Exported 21g Da_check:', res1);
  console.log('Exported 21g PL_outputOCR:', res2);

  // Sync photo document to Tl_loại_VP_Toàn_PL.xlsx sheet Photo
  console.log('Checking photo document of 21g in Tl_loại_VP_Toàn_PL.xlsx...');
  const ExcelJS = (await import('exceljs')).default;
  const wbTl = new ExcelJS.Workbook();
  const tlPath = path.join(DA_CHECK_DIR, 'Tl_loại_VP_Toàn_PL.xlsx');
  await wbTl.xlsx.readFile(tlPath);
  const wsPhoto = wbTl.getWorksheet('Photo');
  let hasPhoto = false;
  wsPhoto.eachRow((r) => {
    const val = (r.getCell(3).value || '').toString();
    if (val.includes('thu nợ xã hội hóa GTNT') && val.includes('hạ thế điện')) hasPhoto = true;
  });

  if (!hasPhoto) {
    await appendTaiLieuLoai({
      type: 'photo',
      tenVanBan: 'Báo cáo số 107/BC-UBND ngày 24/08/2021 về công tác thu nợ xã hội hóa GTNT và công tác vận động người dân tham gia đóng góp xây dựng các công trình xã hội hóa GTNT và hạ thế điện tại địa bàn xã Phú Lộc',
      soHoSo: 'PL_2021_21g',
      thbq: 'Vĩnh viễn'
    });
    console.log('Appended photo document to Tl_loại_VP_Toàn_PL.xlsx sheet Photo');
  } else {
    console.log('Photo document already present in Tl_loại_VP_Toàn_PL.xlsx sheet Photo');
  }
}

// ==========================================
// 3. PROCESS PL_2021_21h
// ==========================================
async function process21h() {
  console.log('\n>>> PROCESSING PL_2021_21h...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21h.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const visualH = {
    1: 1, 2: 3, 3: 7, 4: 11, 5: 15, 6: 19, 7: 23, 8: 27, 9: 30, 10: 40, 11: 50, 12: 55
  };
  const starts = [null];
  let curH = 1;
  for (let i = 1; i <= 12; i++) {
    let val = visualH[i];
    if (val === undefined || val < curH) val = curH;
    const maxAllowed = 56 - (12 - i);
    if (val > maxAllowed) val = maxAllowed;
    starts.push(val);
    curH = val + 1;
  }

  const maxSheet = 56;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ quyết định khen thưởng đi của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21h';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 05/01/2021 đến ngày 26/12/2021';
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

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 56 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21h.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21h.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21h.xlsx'));
  console.log('Exported 21h Da_check:', res1);
  console.log('Exported 21h PL_outputOCR:', res2);
}

async function run() {
  await process21f();
  await process21g();
  await process21h();
  console.log('\n=== ALL BATCH 3 (2021) DOSSIERS SUCCESSFULLY PROCESSED ===');
}

run().catch(err => {
  console.error('Error running batch 3 2021:', err);
  process.exit(1);
});
