import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const pad = (n) => String(n).padStart(2, '0');

// ==========================================
// 1. PROCESS PL_2019_19M
// ==========================================
async function process19M() {
  console.log('\n>>> PROCESSING PL_2019_19M...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19M.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Kế hoạch năm 2019 xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19M';
  job.data.soKyHieuHoSo = 'PL_2019_19M';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2019';
  job.data.thoiGianHoSo = 'Từ ngày 05/01/2019 đến ngày 27/12/2019';
  job.data.thbq = 'Vĩnh viễn';

  const starts19M = {
    2: 1, 3: 7, 4: 16, 5: 18, 6: 21, 7: 24, 8: 25, 9: 28, 10: 34,
    11: 37, 12: 39, 13: 42, 14: 46, 15: 48, 16: 50, 17: 52, 18: 54, 19: 55, 20: 59,
    21: 60, 22: 62, 23: 65, 24: 67, 25: 69, 26: 71, 27: 72, 28: 75, 29: 79, 30: 80,
    31: 82, 32: 84, 33: 87, 34: 89, 35: 92, 36: 94, 37: 97, 38: 99, 39: 103, 40: 105,
    41: 106, 42: 109, 43: 111, 44: 113, 45: 115, 46: 118, 47: 120, 48: 123, 49: 126, 50: 128,
    51: 130, 52: 132, 53: 134, 54: 136, 55: 140, 56: 142, 57: 145, 58: 148, 59: 149, 60: 152,
    61: 153, 62: 155, 63: 157, 64: 160, 65: 162, 66: 163, 67: 165, 68: 167, 69: 169, 70: 172,
    71: 176, 72: 177, 73: 178, 74: 182, 75: 184, 76: 187, 77: 190, 78: 196, 79: 198, 80: 200,
    81: 201, 82: 205, 83: 207, 84: 211, 85: 215, 86: 218, 87: 221, 88: 222, 89: 225, 90: 226
  };

  const keys = Object.keys(starts19M).map(Number).sort((a,b)=>a-b);
  const ranges = {};
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const s = starts19M[k];
    let e;
    if (i < keys.length - 1) {
      e = starts19M[keys[i + 1]] - 1;
    } else {
      e = 226;
    }
    ranges[k] = s === e ? pad(s) : `${pad(s)}-${pad(e)}`;
  }

  const activeRows = [];
  let sttCounter = 1;

  for (let i = 0; i < job.data.rows.length; i++) {
    const r = job.data.rows[i];
    const fn = r.sourceFileNames ? r.sourceFileNames[0] : (job.images[i] ? job.images[i].fileName : '');
    if (fn === '001.jpg' || i === 0) {
      continue;
    }

    const num = parseInt(fn.replace('.jpg', ''), 10);
    r.soTT = String(sttCounter++);
    r.toSoTrangSo = ranges[num];
    r.ghiChu = '';

    // Verified corrections
    if (fn === '005.jpg') {
      r.soKyHieuVanBan = '01/KH-BATGT';
      r.ngayThangVanBan = '14/01/2019';
    }
    if (fn === '043.jpg') r.soKyHieuVanBan = '37/KH-UBND';
    if (fn === '063.jpg') r.soKyHieuVanBan = '54/KH-UBND';
    if (fn === '079.jpg') r.soKyHieuVanBan = '70/KH-UBND';
    if (fn === '083.jpg') r.soKyHieuVanBan = '74/KH-UBND';
    if (fn === '087.jpg') r.soKyHieuVanBan = '78/KH-UBND';
    if (fn === '090.jpg') {
      r.soKyHieuVanBan = '82/KH-UBND';
      r.ngayThangVanBan = '27/12/2019';
    }

    activeRows.push(r);
  }

  job.data.rows = activeRows;
  job.data.tongSoToText = `Bản mục lục này gồm ${pad(activeRows.length)} văn bản, 226 tờ`;

  if (job.images) {
    for (const img of job.images) {
      if (img.fileName === '001.jpg') {
        img.status = 'skip';
        img.isExcluded = true;
      }
    }
  }

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated ${jobPath}`);

  const excelOut1 = path.join(DA_CHECK_DIR, 'PL_2019_19M.xlsx');
  const excelOut2 = path.join(OUTPUT_OCR_DIR, 'PL_2019_19M.xlsx');
  await exportJsonToExcel(job, excelOut1);
  await exportJsonToExcel(job, excelOut2);
  console.log(`Exported 19M to:\n  - ${excelOut1}\n  - ${excelOut2}`);
}

// ==========================================
// 2. PROCESS PL_2019_19N
// ==========================================
async function process19N() {
  console.log('\n>>> PROCESSING PL_2019_19N...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19N.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Công văn đi năm 2019 (Quý I) xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19N';
  job.data.soKyHieuHoSo = 'PL_2019_19N';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2019';
  job.data.thoiGianHoSo = 'Từ ngày 03/01/2019 đến ngày 29/03/2019';
  job.data.thbq = 'Vĩnh viễn';

  const activeRows = [];
  let sttCounter = 1;

  for (let i = 0; i < job.data.rows.length; i++) {
    const r = job.data.rows[i];
    const fn = r.sourceFileNames ? r.sourceFileNames[0] : (job.images[i] ? job.images[i].fileName : '');
    if (fn === '001.jpg' || i === 0) {
      continue;
    }

    const curStt = sttCounter++;
    r.soTT = String(curStt);
    r.toSoTrangSo = pad(curStt);
    r.ghiChu = '';

    // Standardize soKyHieu
    if (fn === '209.jpg') {
      r.soKyHieuVanBan = '208/HD.TĐKT';
    } else {
      // Almost all official dispatches follow curStt/UBND
      r.soKyHieuVanBan = `${pad(curStt)}/UBND`;
    }

    if (!r.ngayThangVanBan) {
      r.ngayThangVanBan = '2019';
    }

    activeRows.push(r);
  }

  job.data.rows = activeRows;
  job.data.tongSoToText = `Bản mục lục này gồm ${pad(activeRows.length)} văn bản, 210 tờ`;

  if (job.images) {
    for (const img of job.images) {
      if (img.fileName === '001.jpg') {
        img.status = 'skip';
        img.isExcluded = true;
      }
    }
  }

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated ${jobPath}`);

  const excelOut1 = path.join(DA_CHECK_DIR, 'PL_2019_19N.xlsx');
  const excelOut2 = path.join(OUTPUT_OCR_DIR, 'PL_2019_19N.xlsx');
  await exportJsonToExcel(job, excelOut1);
  await exportJsonToExcel(job, excelOut2);
  console.log(`Exported 19N to:\n  - ${excelOut1}\n  - ${excelOut2}`);
}

async function run() {
  await process19M();
  await process19N();
  console.log('\n>>> BATCH 2019-6 (19M & 19N) COMPLETE!');
}

run().catch(err => {
  console.error('Fatal error in batch 6:', err);
  process.exit(1);
});
