import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const pad = (n) => String(n).padStart(2, '0');

// ==========================================
// 1. PROCESS PL_2019_19A
// ==========================================
async function process19A() {
  console.log('\n>>> PROCESSING PL_2019_19A...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19A.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Hồ sơ công văn đi 2019 xã Phú Lộc tập 2 Quý II (từ ngày 01/04/2019 đến ngày 28/06/2019)';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19A';
  job.data.soKyHieuHoSo = 'PL_2019_19A';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.namGiaiDoan = '2019';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.tongSoToText = 'Gồm: 216 tờ';

  // 214 images: 001 is cover (skip)
  job.images = [];
  for (let i = 1; i <= 214; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1);
    job.images.push({
      fileName: fn,
      status: isSkip ? 'skip' : 'active',
      isExcluded: isSkip
    });
  }

  // Starts map for 213 active documents (002.jpg to 214.jpg)
  const starts19A = {};
  starts19A[2] = 1;
  starts19A[3] = 2; // spans 02-03
  starts19A[4] = 4;
  for (let i = 5; i <= 62; i++) {
    starts19A[i] = i;
  }
  starts19A[63] = 63; // spans 63-64
  starts19A[64] = 65; // spans 65-66
  starts19A[65] = 67;
  for (let i = 66; i <= 214; i++) {
    starts19A[i] = i + 2;
  }

  const keys = Object.keys(starts19A).map(Number).sort((a,b)=>a-b);
  const ranges19A = {};
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const s = starts19A[p];
    let e;
    if (i === keys.length - 1) {
      e = 216;
    } else {
      e = starts19A[keys[i + 1]] - 1;
    }
    ranges19A[p] = (s === e) ? pad(s) : `${pad(s)}-${pad(e)}`;
  }

  // Date fixes and number fixes for 19A
  const manualFixes19A = {
    4: { soKyHieuVanBan: '205/UBND' },
    5: { ngayThangVanBan: '10/04/2019' },
    29: { ngayThangVanBan: '10/04/2019' },
    58: { ngayThangVanBan: '16/04/2019' },
    76: { ngayThangVanBan: '20/05/2019' },
    77: { ngayThangVanBan: '20/05/2019' },
    79: { ngayThangVanBan: '20/05/2019' },
    105: { ngayThangVanBan: '20/05/2019' },
    167: { ngayThangVanBan: '17/06/2019' },
    179: { ngayThangVanBan: '17/06/2019' },
    186: { ngayThangVanBan: '17/06/2019' },
    191: { ngayThangVanBan: '28/06/2019' },
    192: { ngayThangVanBan: '21/06/2019' },
    194: { ngayThangVanBan: '28/06/2019' },
    199: { ngayThangVanBan: '28/06/2019' },
    205: { ngayThangVanBan: '28/06/2019' },
    206: { ngayThangVanBan: '28/06/2019' },
    210: { ngayThangVanBan: '28/06/2019' },
    211: { ngayThangVanBan: '28/06/2019' },
    214: { ngayThangVanBan: '28/06/2019' }
  };

  const activeRows = [];
  let rowIdx = 1;
  const originalRows = job.data.rows || [];

  for (let i = 1; i <= 214; i++) {
    const fnStr = String(i).padStart(3, '0') + '.jpg';
    if (i === 1) continue; // Skip cover

    const orig = originalRows.find(r => r.sourceFileNames && r.sourceFileNames.includes(fnStr)) || originalRows[i - 1] || {};
    
    let so = (orig.soKyHieuVanBan || '').trim();
    let ngay = (orig.ngayThangVanBan || '').trim();
    let trichYeu = (orig.tenLoaiTrichYeu || '').trim();
    let tacGia = (orig.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc').trim();

    // Clean up duplicate strings in trichYeu
    trichYeu = trichYeu.replace(/\s+/g, ' ');
    // Remove repeated name at end if OCR duplicated it e.g. "ông Phạm Mầu Khin, ông Phạm Mầu Khin"
    trichYeu = trichYeu.replace(/(,?\s*[^,]+),\s*\1$/i, '$1');

    if (manualFixes19A[i]) {
      if (manualFixes19A[i].soKyHieuVanBan !== undefined) so = manualFixes19A[i].soKyHieuVanBan;
      if (manualFixes19A[i].ngayThangVanBan !== undefined) ngay = manualFixes19A[i].ngayThangVanBan;
    }

    activeRows.push({
      soTT: String(rowIdx++),
      soKyHieuVanBan: so,
      ngayThangVanBan: ngay,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: ranges19A[i],
      loaiBan: 'Bản gốc',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: [fnStr]
    });
  }

  job.data.rows = activeRows;
  job.data.rowsTrung = [];
  job.updatedAt = new Date().toISOString();
  job.exportedAt = new Date().toISOString();
  job.exportedFileName = 'PL_2019_19A.xlsx';

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  // Export to Excel
  const outDaCheck = path.join(DA_CHECK_DIR, 'PL_2019_19A.xlsx');
  const outOutputOCR = path.join(OUTPUT_OCR_DIR, 'PL_2019_19A.xlsx');

  await exportJsonToExcel(job, outDaCheck);
  fs.copyFileSync(outDaCheck, outOutputOCR);

  console.log(`Saved 19A Excel files successfully (${activeRows.length} rows, sheets 01-216)`);
}

// ==========================================
// 2. PROCESS PL_2019_19B
// ==========================================
async function process19B() {
  console.log('\n>>> PROCESSING PL_2019_19B...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19B.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Hồ sơ báo cáo năm 2019 xã Phú Lộc tập 2 (Quý 3 & 4 từ ngày 01/07/2019 đến ngày 29/12/2019)';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19B';
  job.data.soKyHieuHoSo = 'PL_2019_19B';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.namGiaiDoan = '2019';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.tongSoToText = 'Gồm: 292 tờ';

  // 100 images: 001 is cover (skip)
  job.images = [];
  for (let i = 1; i <= 100; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1);
    job.images.push({
      fileName: fn,
      status: isSkip ? 'skip' : 'active',
      isExcluded: isSkip
    });
  }

  const starts19B = {
    2: 1, 3: 2, 4: 3, 5: 7, 6: 9, 7: 14, 8: 17, 9: 19, 10: 20,
    11: 21, 12: 22, 13: 23, 14: 24, 15: 29, 16: 31, 17: 32, 18: 33, 19: 34, 20: 39,
    21: 42, 22: 43, 23: 47, 24: 50, 25: 51, 26: 53, 27: 54, 28: 55, 29: 56, 30: 57,
    31: 64, 32: 65, 33: 66, 34: 80, 35: 84, 36: 85, 37: 86, 38: 88, 39: 97, 40: 98,
    41: 102, 42: 103, 43: 106, 44: 107, 45: 108, 46: 110, 47: 113, 48: 114, 49: 118, 50: 119,
    51: 121, 52: 123, 53: 124, 54: 133, 55: 136, 56: 139, 57: 145, 58: 146, 59: 148, 60: 154,
    61: 157, 62: 160, 63: 162, 64: 165, 65: 178, 66: 179, 67: 180, 68: 182, 69: 184, 70: 188,
    71: 189, 72: 192, 73: 199, 74: 202, 75: 207, 76: 208, 77: 211, 78: 213, 79: 216, 80: 219,
    81: 221, 82: 226, 83: 227, 84: 228, 85: 230, 86: 233, 87: 234, 88: 249, 89: 250, 90: 256,
    91: 258, 92: 260, 93: 262, 94: 264, 95: 271, 96: 278, 97: 281, 98: 286, 99: 290, 100: 291
  };

  const keys = Object.keys(starts19B).map(Number).sort((a,b)=>a-b);
  const ranges19B = {};
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const s = starts19B[p];
    let e;
    if (i === keys.length - 1) {
      e = 292;
    } else {
      e = starts19B[keys[i + 1]] - 1;
    }
    ranges19B[p] = (s === e) ? pad(s) : `${pad(s)}-${pad(e)}`;
  }

  const activeRows = [];
  let rowIdx = 1;
  const originalRows = job.data.rows || [];

  for (let i = 2; i <= 100; i++) {
    const fnStr = String(i).padStart(3, '0') + '.jpg';
    const orig = originalRows.find(r => r.sourceFileNames && r.sourceFileNames.includes(fnStr)) || originalRows[i - 1] || {};

    let so = (orig.soKyHieuVanBan || '').trim();
    let ngay = (orig.ngayThangVanBan || '').trim();
    let trichYeu = (orig.tenLoaiTrichYeu || '').trim();
    let tacGia = (orig.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc').trim();

    if (i === 100) {
      ngay = '12/2019';
      tacGia = 'Ủy ban nhân dân xã Phú Lộc';
    }

    activeRows.push({
      soTT: String(rowIdx++),
      soKyHieuVanBan: so,
      ngayThangVanBan: ngay,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: ranges19B[i],
      loaiBan: 'Bản gốc',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: [fnStr]
    });
  }

  job.data.rows = activeRows;
  job.data.rowsTrung = [];
  job.updatedAt = new Date().toISOString();
  job.exportedAt = new Date().toISOString();
  job.exportedFileName = 'PL_2019_19B.xlsx';

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  // Export to Excel
  const outDaCheck = path.join(DA_CHECK_DIR, 'PL_2019_19B.xlsx');
  const outOutputOCR = path.join(OUTPUT_OCR_DIR, 'PL_2019_19B.xlsx');

  await exportJsonToExcel(job, outDaCheck);
  fs.copyFileSync(outDaCheck, outOutputOCR);

  console.log(`Saved 19B Excel files successfully (${activeRows.length} rows, sheets 01-292)`);
}

async function main() {
  await process19A();
  await process19B();
  console.log('\n========================================');
  console.log('BATCH 2019-1 PROCESSED AND EXPORTED SUCCESSFULLY!');
  console.log('========================================\n');
}

main().catch(err => {
  console.error('Fatal error processing Batch 2019-1:', err);
  process.exit(1);
});
