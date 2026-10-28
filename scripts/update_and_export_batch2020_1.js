import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// ==========================================
// 1. PROCESS PL_2020_20A
// ==========================================
async function process20A() {
  console.log('\n>>> PROCESSING PL_2020_20A...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20A.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const starts = {
    2: 1, 3: 4, 4: 6, 5: 8, 6: 10, 7: 12, 8: 13, 9: 15, 10: 16,
    11: 18, 12: 23, 13: 25, 14: 27, 15: 29, 16: 32, 17: 34, 18: 35, 19: 37, 20: 40,
    21: 42, 22: 44, 23: 47, 24: 48, 25: 50, 26: 53, 27: 56, 28: 58, 29: 60, 30: 63,
    31: 65, 32: 66, 33: 67, 34: 73, 35: 74, 36: 75, 37: 79, 38: 81, 39: 83, 40: 86,
    41: 88, 42: 91, 43: 92, 44: 94, 45: 97, 46: 100, 47: 101, 48: 103, 49: 105, 50: 107,
    51: 110, 52: 111, 53: 115, 54: 118, 55: 119, 56: 120, 57: 121, 58: 124, 59: 126, 60: 129,
    61: 132, 62: 136, 63: 137, 64: 138, 65: 140
  };

  const pad = n => String(n).padStart(2, '0');
  const ranges = {};
  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const cur = starts[p];
    if (p === 65) {
      ranges[p] = `${pad(cur)}-141`;
    } else {
      const nextP = keys[i+1];
      const next = starts[nextP];
      if (next - 1 === cur) {
        ranges[p] = pad(cur);
      } else {
        ranges[p] = `${pad(cur)}-${pad(next - 1)}`;
      }
    }
  }

  // Backup original
  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  // Update images: 001 is skip (cover), 066 is skip (merged into 065)
  job.images = [];
  for (let i = 1; i <= 66; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1 || i === 66);
    job.images.push({
      fileName: fn,
      status: isSkip ? 'skip' : 'active',
      isExcluded: isSkip
    });
  }

  const activeRows = [];
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const fn = String(p).padStart(3, '0') + '.jpg';
    const r = job.data.rows.find(row => row.sourceFileNames && row.sourceFileNames.includes(fn)) || job.data.rows[p - 1];

    let trichYeu = (r.tenLoaiTrichYeu || '').trim();
    trichYeu = trichYeu.replace(/^v\/v:?\s*/i, 'về việc ');
    trichYeu = trichYeu.replace(/^về việc\s*/i, 'về việc ');

    let soKyHieu = (r.soKyHieuVanBan || '').trim();
    soKyHieu = soKyHieu.replace(/^số:?\s*/i, '');

    const sourceFiles = [fn];
    if (p === 65) {
      sourceFiles.push('066.jpg');
    }

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: r.ngayThangVanBan || '',
      tenLoaiTrichYeu: trichYeu,
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
  job.data.tenHoSo = 'Hồ sơ về kế hoạch công tác của UBND xã Phú Lộc năm 2020';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2020_20A';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Từ ngày 04/02/2020 đến ngày 30/12/2020';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 141 tờ`;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated PL_2020_20A.job.json with ${activeRows.length} rows`);

  const exportData20A = {
    ...job.data,
    rows: job.data.rows
  };

  const res1A = await exportJsonToExcel(exportData20A, path.join(DA_CHECK_DIR, 'PL_2020_20A.xlsx'));
  const res2A = await exportJsonToExcel(exportData20A, path.join(OUTPUT_OCR_DIR, 'PL_2020_20A.xlsx'));
  console.log('Exported 20A Da_check:', res1A);
  console.log('Exported 20A PL_outputOCR:', res2A);
}

// ==========================================
// 2. PROCESS PL_2020_20B
// ==========================================
async function process20B() {
  console.log('\n>>> PROCESSING PL_2020_20B...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20B.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const starts = {
    2: 1, 3: 3, 4: 10, 5: 11, 6: 12, 7: 16, 8: 17, 9: 19, 10: 20,
    11: 21, 12: 22, 13: 23, 14: 25, 15: 26, 16: 31, 17: 33, 18: 34, 19: 36, 20: 37,
    21: 39, 22: 40, 23: 41, 24: 42, 25: 43, 26: 44, 27: 45, 28: 49, 29: 51, 30: 64,
    31: 75, 32: 78, 33: 84, 34: 85, 35: 86, 36: 90, 37: 91, 38: 92, 39: 94, 40: 97,
    41: 99, 42: 100, 43: 106, 44: 116, 45: 119, 46: 120, 47: 125, 48: 126, 49: 127, 50: 131,
    51: 132, 52: 139, 53: 141, 54: 143, 55: 144, 56: 145, 57: 146, 58: 147, 59: 148, 60: 149,
    61: 150, 62: 154, 63: 156, 64: 157, 65: 158, 66: 162, 67: 166, 68: 167, 69: 170, 70: 174,
    71: 177, 72: 178, 73: 183, 74: 185, 75: 186, 76: 188, 77: 191, 78: 193, 79: 194, 80: 205,
    81: 208, 82: 209, 83: 210, 84: 213, 85: 221, 86: 222, 87: 225, 88: 226, 89: 228, 90: 237,
    91: 245, 92: 248, 93: 250, 94: 251, 95: 252, 96: 253, 97: 255, 98: 264, 99: 268, 100: 272,
    101: 275, 102: 278, 103: 281, 104: 287, 105: 298, 106: 299, 107: 300, 108: 301, 109: 302, 110: 304
  };

  const pad = n => String(n).padStart(2, '0');
  const ranges = {};
  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const cur = starts[p];
    if (p === 110) {
      ranges[p] = pad(cur);
    } else {
      const nextP = keys[i+1];
      const next = starts[nextP];
      if (next - 1 === cur) {
        ranges[p] = pad(cur);
      } else {
        ranges[p] = `${pad(cur)}-${pad(next - 1)}`;
      }
    }
  }

  // Backup original
  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  // Update images: 001 is skip (cover)
  job.images = [];
  for (let i = 1; i <= 110; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1);
    job.images.push({
      fileName: fn,
      status: isSkip ? 'skip' : 'active',
      isExcluded: isSkip
    });
  }

  const activeRows = [];
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const fn = String(p).padStart(3, '0') + '.jpg';
    const r = job.data.rows.find(row => row.sourceFileNames && row.sourceFileNames.includes(fn)) || job.data.rows[p - 1];

    let trichYeu = (r.tenLoaiTrichYeu || '').trim();
    trichYeu = trichYeu.replace(/^v\/v:?\s*/i, 'về việc ');
    trichYeu = trichYeu.replace(/^về việc\s*/i, 'về việc ');

    let soKyHieu = (r.soKyHieuVanBan || '').trim();
    soKyHieu = soKyHieu.replace(/^số:?\s*/i, '');

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: r.ngayThangVanBan || '',
      tenLoaiTrichYeu: trichYeu,
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
  job.data.tenHoSo = 'Hồ sơ về báo cáo công tác của UBND xã Phú Lộc năm 2020';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2020_20B';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Từ ngày 01/07/2020 đến ngày 29/12/2020';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 304 tờ`;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated PL_2020_20B.job.json with ${activeRows.length} rows`);

  const exportData20B = {
    ...job.data,
    rows: job.data.rows
  };

  const res1B = await exportJsonToExcel(exportData20B, path.join(DA_CHECK_DIR, 'PL_2020_20B.xlsx'));
  const res2B = await exportJsonToExcel(exportData20B, path.join(OUTPUT_OCR_DIR, 'PL_2020_20B.xlsx'));
  console.log('Exported 20B Da_check:', res1B);
  console.log('Exported 20B PL_outputOCR:', res2B);
}

async function main() {
  await process20A();
  await process20B();
}

main().catch(console.error);
