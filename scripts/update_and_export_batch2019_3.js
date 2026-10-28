import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const pad = (n) => String(n).padStart(2, '0');

// ==========================================
// 1. PROCESS PL_2019_19E
// ==========================================
async function process19E() {
  console.log('\n>>> PROCESSING PL_2019_19E...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19E.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Báo cáo Công văn đi năm 2019 (Quý I và II) xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19E';
  job.data.soKyHieuHoSo = 'PL_2019_19E';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2019';
  job.data.thoiGianHoSo = 'Từ ngày 02/01/2019 đến ngày 28/06/2019';
  job.data.thbq = 'Vĩnh viễn';

  // Start sheets
  const starts = {
    2: 1, 3: 3, 4: 5, 5: 6, 6: 7, 7: 10, 8: 11, 9: 15, 10: 16,
    11: 17, 12: 18, 13: 20, 14: 23, 15: 26, 16: 27, 17: 28, 18: 29, 19: 30, 20: 31,
    21: 34, 22: 35, 23: 40, 24: 53, 25: 54, 26: 55, 27: 57, 28: 58, 29: 60, 30: 62,
    31: 63, 32: 66, 33: 70, 34: 71, 35: 73, 36: 75, 37: 78, 38: 85, 39: 91, 40: 92,
    41: 94, 42: 97, 43: 103, 44: 105, 45: 109, 46: 115, 47: 116, 48: 121, 49: 123, 50: 124,
    51: 126, 52: 128, 53: 130, 54: 134, 55: 135, 56: 138, 57: 140, 58: 146, 59: 149, 60: 152,
    61: 153, 62: 156, 63: 158, 64: 162, 65: 163, 66: 164, 67: 165, 68: 166, 69: 167, 70: 168,
    71: 170, 72: 173, 73: 177
  };

  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
  const ranges = {};
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const s = starts[k];
    let e;
    if (i < keys.length - 1) {
      e = starts[keys[i + 1]] - 1;
    } else {
      e = 177;
    }
    ranges[k] = s === e ? pad(s) : `${pad(s)}-${pad(e)}`;
  }

  // Update rows
  const activeRows = [];
  let sttCounter = 1;

  for (let i = 0; i < job.data.rows.length; i++) {
    const r = job.data.rows[i];
    const fn = r.sourceFileNames ? r.sourceFileNames[0] : '';
    if (fn === '001.jpg') {
      // Cover -> mark skip in images
      continue;
    }

    const num = parseInt(fn.replace('.jpg', ''), 10);
    r.soTT = String(sttCounter++);
    r.toSoTrangSo = ranges[num];
    r.ghiChu = '';

    // Specific verified corrections
    if (fn === '014.jpg') r.soKyHieuVanBan = '13/BC-UBND';
    if (fn === '017.jpg') r.soKyHieuVanBan = '17/BC-UBND';
    if (fn === '018.jpg') r.soKyHieuVanBan = '18/BC-UBND';
    if (fn === '022.jpg') {
      r.soKyHieuVanBan = '22/BC-UBND';
      r.ngayThangVanBan = '11/03/2019';
    }
    if (fn === '024.jpg') r.soKyHieuVanBan = '';
    if (fn === '030.jpg') r.soKyHieuVanBan = '27/BC-UBND';
    if (fn === '052.jpg') r.soKyHieuVanBan = '50/BC-UBND';
    if (fn === '065.jpg') r.soKyHieuVanBan = '63/BC-UBND';
    if (fn === '072.jpg') r.soKyHieuVanBan = '70/BC-UBND';
    if (fn === '073.jpg') r.soKyHieuVanBan = '71/BC-UBND';

    activeRows.push(r);
  }

  job.data.rows = activeRows;
  job.data.tongSoToText = `Bản mục lục này gồm ${pad(activeRows.length)} văn bản, 177 tờ`;

  // Update images list
  if (job.images) {
    for (const img of job.images) {
      if (img.fileName === '001.jpg') {
        img.status = 'skip';
        img.isExcluded = true;
      }
    }
  }

  // Save JSON
  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated ${jobPath}`);

  // Export Excel
  const excelOut1 = path.join(DA_CHECK_DIR, 'PL_2019_19E.xlsx');
  const excelOut2 = path.join(OUTPUT_OCR_DIR, 'PL_2019_19E.xlsx');
  await exportJsonToExcel(job, excelOut1);
  await exportJsonToExcel(job, excelOut2);
  console.log(`Exported 19E to:\n  - ${excelOut1}\n  - ${excelOut2}`);
}

// ==========================================
// 2. PROCESS PL_2019_19F
// ==========================================
async function process19F() {
  console.log('\n>>> PROCESSING PL_2019_19F...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19F.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Chương trình công tác quý I của Ủy ban nhân dân xã Phú Lộc năm 2019';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19F';
  job.data.soKyHieuHoSo = 'PL_2019_19F';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2019';
  job.data.thoiGianHoSo = '15/01/2019';
  job.data.thbq = 'Vĩnh viễn';

  // Only 002.jpg is active row
  const activeRows = [];
  let sttCounter = 1;

  for (let i = 0; i < job.data.rows.length; i++) {
    const r = job.data.rows[i];
    const fn = r.sourceFileNames ? r.sourceFileNames[0] : '';
    if (fn === '001.jpg') {
      continue;
    }

    r.soTT = String(sttCounter++);
    r.soKyHieuVanBan = '01/CTr-UBND';
    r.ngayThangVanBan = '15/01/2019';
    r.tacGiaVanBan = 'Ủy ban nhân dân xã Phú Lộc';
    r.tenLoaiTrichYeu = 'Chương trình công tác quý I của Ủy ban nhân dân xã Phú Lộc năm 2019';
    r.toSoTrangSo = '01';
    r.loaiBan = 'Bản gốc';
    r.ghiChu = '';

    activeRows.push(r);
  }

  job.data.rows = activeRows;
  job.data.tongSoToText = `Bản mục lục này gồm 01 văn bản, 01 tờ`;

  // Update images list
  if (job.images) {
    for (const img of job.images) {
      if (img.fileName === '001.jpg') {
        img.status = 'skip';
        img.isExcluded = true;
      }
    }
  }

  // Save JSON
  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated ${jobPath}`);

  // Export Excel
  const excelOut1 = path.join(DA_CHECK_DIR, 'PL_2019_19F.xlsx');
  const excelOut2 = path.join(OUTPUT_OCR_DIR, 'PL_2019_19F.xlsx');
  await exportJsonToExcel(job, excelOut1);
  await exportJsonToExcel(job, excelOut2);
  console.log(`Exported 19F to:\n  - ${excelOut1}\n  - ${excelOut2}`);
}

async function run() {
  await process19E();
  await process19F();
}

run();
