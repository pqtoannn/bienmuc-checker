import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

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
// 1. PROCESS PL_2021_21m
// ==========================================
async function process21m() {
  console.log('\n>>> PROCESSING PL_2021_21m...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21m.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 58 photos: idx 0 is cover (001.jpg)
  // 57 active documents: idx 1 to 57 (002.jpg to 058.jpg)
  // Total sheets: 71 sheets
  const startsMap = {
    1: 1,   // 002.jpg
    2: 2,   // 003.jpg (marked 1a)
    3: 3,   // 004.jpg
    4: 5,   // 005.jpg
    5: 6,   // 006.jpg
    6: 8,   // 007.jpg
    7: 10,  // 008.jpg
    8: 11,  // 009.jpg
    9: 12,  // 010.jpg
    10: 13, // 011.jpg
    11: 15, // 012.jpg
    12: 16, // 013.jpg
    13: 18, // 014.jpg
    14: 20, // 015.jpg
    15: 22, // 016.jpg
    16: 23, // 017.jpg
    17: 24, // 018.jpg
    18: 25, // 019.jpg
    19: 26, // 020.jpg
    20: 28, // 021.jpg
    21: 29, // 022.jpg
    22: 30, // 023.jpg
    23: 31, // 024.jpg
    24: 32, // 025.jpg
    25: 33, // 026.jpg
    26: 34, // 027.jpg
    27: 35, // 028.jpg
    28: 36, // 029.jpg
    29: 37, // 030.jpg
    30: 38, // 031.jpg
    31: 39, // 032.jpg
    32: 40, // 033.jpg
    33: 41, // 034.jpg
    34: 42, // 035.jpg
    35: 43, // 036.jpg
    36: 44, // 037.jpg
    37: 45, // 038.jpg
    38: 46, // 039.jpg
    39: 47, // 040.jpg
    40: 48, // 041.jpg
    41: 50, // 042.jpg
    42: 52, // 043.jpg
    43: 54, // 044.jpg
    44: 56, // 045.jpg
    45: 58, // 046.jpg
    46: 59, // 047.jpg
    47: 60, // 048.jpg
    48: 61, // 049.jpg
    49: 62, // 050.jpg
    50: 63, // 051.jpg
    51: 64, // 052.jpg
    52: 65, // 053.jpg
    53: 66, // 054.jpg
    54: 68, // 055.jpg
    55: 69, // 056.jpg
    56: 70, // 057.jpg
    57: 71  // 058.jpg
  };

  const starts = [null];
  for (let idx = 1; idx <= 57; idx++) {
    starts.push(startsMap[idx]);
  }

  const maxSheet = 71;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ quyết định đi (quý I) của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21m';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 04/01/2021 đến ngày 29/03/2021';
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
      if (!row.tacGiaVanBan) {
        row.tacGiaVanBan = 'Ủy ban nhân dân xã Phú Lộc';
      }

      if (row.soKyHieuVanBan) {
        row.soKyHieuVanBan = row.soKyHieuVanBan.replace(/O/g, '0').trim();
      }
    }
  });

  // Targeted corrections for 21m
  if (job.data.rows[11]) job.data.rows[11].soKyHieuVanBan = '09/QĐ-UBND'; // 012.jpg
  if (job.data.rows[16]) job.data.rows[16].soKyHieuVanBan = '15/QĐ-UBND'; // 017.jpg
  if (job.data.rows[19]) {
    job.data.rows[19].soKyHieuVanBan = '18/QĐ-UBND'; // 020.jpg
    job.data.rows[19].ngayThangVanBan = '25/01/2021';
  }
  if (job.data.rows[50]) job.data.rows[50].soKyHieuVanBan = '53/QĐ-UBND'; // 051.jpg
  if (job.data.rows[56]) {
    job.data.rows[56].soKyHieuVanBan = '57/QĐ-BCH'; // 057.jpg
    job.data.rows[56].tacGiaVanBan = 'Ban Chỉ huy Quân sự xã Phú Lộc';
  }

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.fileName === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 71 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21m.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21m.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21m.xlsx'));
  console.log('Exported 21m Da_check:', res1);
  console.log('Exported 21m PL_outputOCR:', res2);
}

// ==========================================
// 2. PROCESS PL_2021_21n
// ==========================================
async function process21n() {
  console.log('\n>>> PROCESSING PL_2021_21n...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21n.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 94 photos: idx 0 is cover (001.jpg)
  // 93 active documents: idx 1 to 93 (002.jpg to 094.jpg)
  // Total sheets: 244 sheets
  const startsMap = {
    1: 1, 2: 3, 3: 5, 4: 7, 5: 8, 6: 10, 7: 11, 8: 13, 9: 15, 10: 17,
    11: 20, 12: 23, 13: 25, 14: 28, 15: 31, 16: 33, 17: 34, 18: 35, 19: 38, 20: 40,
    21: 42, 22: 44, 23: 47, 24: 50, 25: 52, 26: 56, 27: 58, 28: 60, 29: 62, 30: 64,
    31: 67, 32: 69, 33: 71, 34: 76, 35: 79, 36: 81, 37: 82, 38: 85, 39: 87, 40: 89,
    41: 93, 42: 95, 43: 97, 44: 100, 45: 103, 46: 106, 47: 108, 48: 110, 49: 113, 50: 116,
    51: 118, 52: 123, 53: 125, 54: 128, 55: 131, 56: 134, 57: 137, 58: 140, 59: 142, 60: 144,
    61: 147, 62: 152, 63: 156, 64: 157, 65: 160, 66: 163, 67: 167, 68: 173, 69: 176, 70: 178,
    71: 183, 72: 185, 73: 187, 74: 189, 75: 192, 76: 195, 77: 199, 78: 203, 79: 206, 80: 209,
    81: 212, 82: 213, 83: 216, 84: 219, 85: 221, 86: 224, 87: 227, 88: 230, 89: 233, 90: 235,
    91: 236, 92: 240, 93: 243
  };

  const starts = [null];
  for (let idx = 1; idx <= 93; idx++) {
    starts.push(startsMap[idx]);
  }

  const maxSheet = 244;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ kế hoạch của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21n';
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
      row.loaiBan = 'Bản gốc';
      if (!row.tacGiaVanBan) {
        row.tacGiaVanBan = 'Ủy ban nhân dân xã Phú Lộc';
      }

      if (row.soKyHieuVanBan) {
        row.soKyHieuVanBan = row.soKyHieuVanBan.replace(/O/g, '0').trim();
      }
    }
  });

  // Targeted corrections for 21n
  if (job.data.rows[20]) {
    job.data.rows[20].soKyHieuVanBan = '18/KH-UBND'; // 021.jpg
    job.data.rows[20].ngayThangVanBan = '18/02/2021';
  }
  if (job.data.rows[28]) {
    job.data.rows[28].soKyHieuVanBan = '29/KH-UBND'; // 029.jpg
    job.data.rows[28].ngayThangVanBan = '24/02/2021';
  }
  if (job.data.rows[32]) {
    job.data.rows[32].soKyHieuVanBan = '31/KH-UBND'; // 033.jpg
    job.data.rows[32].ngayThangVanBan = '05/03/2021';
  }
  if (job.data.rows[52]) {
    job.data.rows[52].soKyHieuVanBan = '52/KH-HĐ.NVQS'; // 053.jpg
    job.data.rows[52].ngayThangVanBan = '14/05/2021';
    job.data.rows[52].tacGiaVanBan = 'Hội đồng Nghĩa vụ Quân sự xã Phú Lộc';
  }
  if (job.data.rows[60]) {
    job.data.rows[60].ghiChu = ''; // 061.jpg (remove DT-21)
  }
  if (job.data.rows[68]) {
    job.data.rows[68].soKyHieuVanBan = '68/KH-UBND'; // 069.jpg
    job.data.rows[68].ngayThangVanBan = '27/08/2021';
  }
  if (job.data.rows[69]) {
    job.data.rows[69].soKyHieuVanBan = '69/KH-UBND'; // 070.jpg
    job.data.rows[69].ngayThangVanBan = '31/08/2021';
  }
  if (job.data.rows[73]) {
    job.data.rows[73].soKyHieuVanBan = '73/KH-UBND'; // 074.jpg
    job.data.rows[73].ngayThangVanBan = '28/09/2021';
  }
  if (job.data.rows[80]) {
    job.data.rows[80].soKyHieuVanBan = '81/KH-HĐ.NVQS'; // 081.jpg
    job.data.rows[80].ngayThangVanBan = '08/11/2021';
    job.data.rows[80].tacGiaVanBan = 'Hội đồng Nghĩa vụ Quân sự xã Phú Lộc';
  }
  if (job.data.rows[81]) {
    job.data.rows[81].soKyHieuVanBan = '82/KH-HĐ.GDQP&AN'; // 082.jpg
    job.data.rows[81].ngayThangVanBan = '15/11/2021';
    job.data.rows[81].tacGiaVanBan = 'Hội đồng Giáo dục Quốc phòng và An ninh xã Phú Lộc';
  }
  if (job.data.rows[84]) {
    job.data.rows[84].soKyHieuVanBan = '86/KH-UBND'; // 085.jpg
    job.data.rows[84].ngayThangVanBan = '26/11/2021';
  }
  if (job.data.rows[92]) {
    job.data.rows[92].soKyHieuVanBan = '05/KH-HĐGDQPAN'; // 093.jpg
    job.data.rows[92].ngayThangVanBan = '17/12/2021';
    job.data.rows[92].tacGiaVanBan = 'Hội đồng Giáo dục Quốc phòng và An ninh xã Phú Lộc';
  }

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.fileName === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 244 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21n.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21n.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21n.xlsx'));
  console.log('Exported 21n Da_check:', res1);
  console.log('Exported 21n PL_outputOCR:', res2);
}

async function main() {
  await process21m();
  await process21n();
  console.log('\n>>> COMPLETED BATCH 6 (2021)!');
}

main().catch(err => {
  console.error('Batch 6 processing failed:', err);
  process.exit(1);
});
