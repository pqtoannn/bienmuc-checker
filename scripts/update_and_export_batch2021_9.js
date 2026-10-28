import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// ==========================================
// 1. PROCESS PL_2021_21S
// ==========================================
async function process21S() {
  console.log('\n>>> PROCESSING PL_2021_21S...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21S.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 161 photos: 001.jpg to 162.jpg (092 missing)
  // 001.jpg is cover note -> exclude
  // 002.jpg to 160.jpg: active docs (158 docs)
  // 161.jpg and 162.jpg: doc 159 (report 393 + annex table 402 -> sheets 393-402)
  // Total active documents: 159
  // Total sheets: 402

  const starts = {
    2: 1, 3: 2, 4: 9, 5: 11, 6: 13, 7: 15, 8: 18, 9: 34, 10: 37,
    11: 39, 12: 41, 13: 42, 14: 43, 15: 45, 16: 47, 17: 49, 18: 50, 19: 52, 20: 53,
    21: 55, 22: 57, 23: 58, 24: 60, 25: 66, 26: 67, 27: 68, 28: 69, 29: 71, 30: 73,
    31: 82, 32: 83, 33: 84, 34: 85, 35: 86, 36: 87, 37: 88, 38: 90, 39: 91, 40: 92,
    41: 93, 42: 94, 43: 96, 44: 97, 45: 98, 46: 118, 47: 120, 48: 122, 49: 123, 50: 125,
    51: 126, 52: 127, 53: 128, 54: 129, 55: 130, 56: 132, 57: 133, 58: 134, 59: 135, 60: 137,
    61: 138, 62: 139, 63: 141, 64: 142, 65: 143, 66: 145, 67: 147, 68: 149, 69: 152, 70: 154,
    71: 163, 72: 165, 73: 167, 74: 169, 75: 171, 76: 173, 77: 175, 78: 178, 79: 180, 80: 183,
    81: 185, 82: 186, 83: 188, 84: 190, 85: 192, 86: 194, 87: 196, 88: 200, 89: 202, 90: 204,
    91: 206, /* 92 missing */
    93: 215, 94: 217, 95: 218, 96: 219, 97: 221, 98: 223, 99: 224, 100: 232,
    101: 243, 102: 246, 103: 247, 104: 249, 105: 251, 106: 252, 107: 253, 108: 254, 109: 255, 110: 256,
    111: 257, 112: 265, 113: 266, 114: 268, 115: 270, 116: 271, 117: 274, 118: 275, 119: 276, 120: 277,
    121: 278, 122: 279, 123: 280, 124: 281, 125: 282, 126: 283, 127: 284, 128: 286, 129: 288, 130: 289,
    131: 290, 132: 291, 133: 292, 134: 293, 135: 294, 136: 303, 137: 306, 138: 308, 139: 309, 140: 322,
    141: 323, 142: 324, 143: 325, 144: 327, 145: 328, 146: 341, 147: 347, 148: 360, 149: 364, 150: 366,
    151: 368, 152: 370, 153: 385, 154: 386, 155: 387, 156: 388, 157: 389, 158: 390, 159: 391, 160: 392,
    161: 393, 162: 402
  };

  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
  const ranges = {};

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    if (p === 162) continue; // annex of 161
    const startNum = starts[p];
    const nextP = keys[i + 1];
    let endNum;
    if (p === 161) {
      endNum = starts[162]; // 402
    } else {
      endNum = starts[nextP] - 1;
    }
    
    if (startNum === endNum) {
      ranges[p] = String(startNum).padStart(2, '0');
    } else {
      ranges[p] = `${String(startNum).padStart(2, '0')}-${String(endNum).padStart(2, '0')}`;
    }
  }

  // Update job.images status
  job.images = [];
  for (let i = 1; i <= 162; i++) {
    if (i === 92) continue;
    const fn = String(i).padStart(3, '0') + '.jpg';
    job.images.push({
      fileName: fn,
      status: (i === 1 || i === 162) ? 'skip' : 'active',
      isExcluded: (i === 1 || i === 162)
    });
  }

  // Map active rows from job.data.rows
  // row 0 corresponds to 001.jpg (exclude)
  // row 1..158 correspond to 002.jpg..160.jpg
  // row 159 corresponds to 161.jpg (merged with 162.jpg)
  const activeRows = [];
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    if (p === 162) continue;
    const fn = String(p).padStart(3, '0') + '.jpg';
    const r = job.data.rows.find(row => row.sourceFileNames && row.sourceFileNames.includes(fn));
    if (!r) {
      console.warn(`Could not find row for ${fn}`);
      continue;
    }
    const isDoc161 = (p === 161);
    const sourceFiles = isDoc161 ? ['161.jpg', '162.jpg'] : [fn];
    const isSaoY = (p === 90);

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: r.soKyHieuVanBan || '',
      ngayThangVanBan: r.ngayThangVanBan || '',
      tenLoaiTrichYeu: r.tenLoaiTrichYeu || '',
      tacGiaVanBan: r.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: ranges[p],
      loaiBan: isSaoY ? 'Bản sao' : 'Bản gốc',
      ghiChu: '',
      banGocChinh: isSaoY ? '' : 'Bản gốc',
      banSao: isSaoY ? 'Bản sao' : '',
      doMat: '',
      sourceFileNames: sourceFiles
    });
  }

  job.data.rows = activeRows;
  job.data.tenHoSo = 'Hồ sơ khen thưởng (tập 2) của UBND xã Phú Lộc năm 2023 - 2024';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21S';
  job.data.namGiaiDoan = '2023-2024';
  job.data.thoiGianHoSo = 'Từ ngày 20/03/2023 đến ngày 22/11/2024';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 402 tờ`;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated PL_2021_21S.job.json with ${activeRows.length} rows`);

  const exportData21S = {
    ...job.data,
    rows: job.data.rows
  };

  const res1S = await exportJsonToExcel(exportData21S, path.join(DA_CHECK_DIR, 'PL_2021_21S.xlsx'));
  const res2S = await exportJsonToExcel(exportData21S, path.join(OUTPUT_OCR_DIR, 'PL_2021_21S.xlsx'));
  console.log('Exported 21S Da_check:', res1S);
  console.log('Exported 21S PL_outputOCR:', res2S);
}

// ==========================================
// 2. PROCESS PL_2021_21T
// ==========================================
async function process21T() {
  console.log('\n>>> PROCESSING PL_2021_21T...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21T.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 21 photos: 001.jpg to 021.jpg
  // 001.jpg is ACTIVE doc 1 starting at sheet 01 (NOT a cover note!)
  // All 21 photos are active documents!
  // Total sheets: 155 (doc 21: sheets 154-155)

  const starts = {
    1: 1, 2: 17, 3: 36, 4: 43, 5: 57, 6: 62, 7: 65, 8: 68, 9: 83, 10: 84,
    11: 88, 12: 90, 13: 93, 14: 98, 15: 106, 16: 108, 17: 121, 18: 127, 19: 129, 20: 136,
    21: 154
  };

  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
  const ranges = {};

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const startNum = starts[p];
    let endNum;
    if (i === keys.length - 1) {
      endNum = 155; // 2-page report
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
  for (let i = 1; i <= 21; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    job.images.push({
      fileName: fn,
      status: 'active',
      isExcluded: false
    });
  }

  // Map active rows from job.data.rows
  const activeRows = [];
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const fn = String(p).padStart(3, '0') + '.jpg';
    const r = job.data.rows.find(row => row.sourceFileNames && row.sourceFileNames.includes(fn)) || job.data.rows[i];
    
    const isSao = (p === 3 || p === 4);

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: r.soKyHieuVanBan || '',
      ngayThangVanBan: r.ngayThangVanBan || '',
      tenLoaiTrichYeu: r.tenLoaiTrichYeu || '',
      tacGiaVanBan: r.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: ranges[p],
      loaiBan: isSao ? 'Bản sao' : 'Bản gốc',
      ghiChu: '',
      banGocChinh: isSao ? '' : 'Bản gốc',
      banSao: isSao ? 'Bản sao' : '',
      doMat: '',
      sourceFileNames: [fn]
    });
  }

  job.data.rows = activeRows;
  job.data.tenHoSo = 'Hồ sơ khen thưởng (tập 3) của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21T';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 17/04/2021 đến ngày 14/12/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 155 tờ`;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated PL_2021_21T.job.json with ${activeRows.length} rows`);

  const exportData21T = {
    ...job.data,
    rows: job.data.rows
  };

  const res1T = await exportJsonToExcel(exportData21T, path.join(DA_CHECK_DIR, 'PL_2021_21T.xlsx'));
  const res2T = await exportJsonToExcel(exportData21T, path.join(OUTPUT_OCR_DIR, 'PL_2021_21T.xlsx'));
  console.log('Exported 21T Da_check:', res1T);
  console.log('Exported 21T PL_outputOCR:', res2T);
}

async function main() {
  await process21S();
  await process21T();
  console.log('\n>>> BATCH 9 COMPLETE!');
}

main().catch(err => {
  console.error('Fatal error in batch 9:', err);
  process.exit(1);
});
