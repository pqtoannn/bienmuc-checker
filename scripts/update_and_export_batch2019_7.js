import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const pad = (n) => String(n).padStart(2, '0');

// ==========================================
// 1. PROCESS PL_2019_19O
// ==========================================
async function process19O() {
  console.log('\n>>> PROCESSING PL_2019_19O...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19O.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Tờ trình năm 2019 xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19O';
  job.data.soKyHieuHoSo = 'PL_2019_19O';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2019';
  job.data.thoiGianHoSo = 'Từ ngày 03/01/2019 đến ngày 27/12/2019';
  job.data.thbq = 'Vĩnh viễn';

  const starts19O = {
    2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 9, 10: 10,
    11: 11, 12: 12, 13: 14, 14: 15, 15: 16, 16: 18, 17: 19, 18: 24, 19: 25, 20: 26,
    21: 27, 22: 30, 23: 31, 24: 32, 25: 33, 26: 34, 27: 35, 28: 36, 29: 37, 30: 38,
    31: 39, 32: 40, 33: 45, 34: 49, 35: 52, 36: 54, 37: 57, 38: 58, 39: 60, 40: 62,
    41: 63, 42: 64, 43: 66, 44: 67, 45: 69, 46: 70, 47: 72, 48: 73, 49: 75, 50: 76,
    51: 78, 52: 79, 53: 80, 54: 82, 55: 83, 56: 85, 57: 86, 58: 88, 59: 89, 60: 90,
    61: 91, 62: 93, 63: 94, 64: 95, 65: 97, 66: 98, 67: 100, 68: 102, 69: 105, 70: 107,
    71: 109, 72: 112, 73: 113, 74: 114, 75: 115, 76: 118, 77: 119, 78: 122, 79: 123, 80: 124,
    81: 125, 82: 126, 83: 128, 84: 129, 85: 130, 86: 132, 87: 134, 88: 135, 89: 136, 90: 137,
    91: 139, 92: 140, 93: 141, 94: 142, 95: 143, 96: 145, 97: 146, 98: 148, 99: 149, 100: 151,
    101: 152, 102: 155, 103: 156, 104: 157, 105: 158, 106: 159, 107: 160, 108: 161, 109: 165
  };

  const keys = Object.keys(starts19O).map(Number).sort((a,b)=>a-b);
  const ranges = {};
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const s = starts19O[k];
    let e;
    if (i < keys.length - 1) {
      e = starts19O[keys[i + 1]] - 1;
    } else {
      e = 165;
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
    if (fn === '005.jpg') r.ngayThangVanBan = '20/01/2019';
    if (fn === '008.jpg') r.soKyHieuVanBan = '07/TTr-UBND';
    if (fn === '010.jpg') r.soKyHieuVanBan = '09/TTr-UBND';
    if (fn === '018.jpg') r.soKyHieuVanBan = '20/TTr-UBND';
    if (fn === '027.jpg') r.soKyHieuVanBan = '24/TTr-UBND';
    if (fn === '038.jpg') r.soKyHieuVanBan = '35/TTr-UBND';
    if (fn === '040.jpg') r.soKyHieuVanBan = '37/TTr-UBND';
    if (fn === '072.jpg') {
      r.soKyHieuVanBan = '71/TTr-UBND';
      r.ngayThangVanBan = '23/08/2019';
    }
    if (fn === '081.jpg') r.soKyHieuVanBan = '80/TTr-UBND';
    if (fn === '083.jpg') r.soKyHieuVanBan = '82/TTr-UBND';
    if (fn === '087.jpg') r.soKyHieuVanBan = '86/TTr-UBND';
    if (fn === '092.jpg') r.soKyHieuVanBan = '91/TTr-UBND';
    if (fn === '097.jpg') r.ngayThangVanBan = '19/11/2019';
    if (fn === '099.jpg') r.soKyHieuVanBan = '98/TTr-UBND';
    if (fn === '100.jpg') r.soKyHieuVanBan = '99/TTr-UBND';
    if (fn === '102.jpg') r.soKyHieuVanBan = '101/TTr-UBND';
    if (fn === '104.jpg') r.soKyHieuVanBan = '104/TTr-UBND';
    if (fn === '105.jpg') r.soKyHieuVanBan = '106/TTr-UBND';
    if (fn === '107.jpg') r.ngayThangVanBan = '25/12/2019';
    if (fn === '109.jpg') {
      r.soKyHieuVanBan = '112/BC-UBND';
      r.ngayThangVanBan = '27/12/2019';
    }

    activeRows.push(r);
  }

  job.data.rows = activeRows;
  job.data.tongSoToText = `Bản mục lục này gồm ${pad(activeRows.length)} văn bản, 165 tờ`;

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

  const excelOut1 = path.join(DA_CHECK_DIR, 'PL_2019_19O.xlsx');
  const excelOut2 = path.join(OUTPUT_OCR_DIR, 'PL_2019_19O.xlsx');
  await exportJsonToExcel(job, excelOut1);
  await exportJsonToExcel(job, excelOut2);
  console.log(`Exported 19O to:\n  - ${excelOut1}\n  - ${excelOut2}`);
}

// ==========================================
// 2. PROCESS PL_2019_19P
// ==========================================
async function process19P() {
  console.log('\n>>> PROCESSING PL_2019_19P...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19P.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Văn bản các loại năm 2019 xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19P';
  job.data.soKyHieuHoSo = 'PL_2019_19P';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2019';
  job.data.thoiGianHoSo = 'Từ ngày 25/01/2019 đến ngày 30/09/2019';
  job.data.thbq = 'Vĩnh viễn';

  const ranges19P = {
    2: '01-04',
    3: '05-06',
    4: '07-08',
    5: '09-12',
    6: '13-16',
    7: '17',
    8: '18-19',
    9: '20-21',
    10: '22-23',
    11: '24-25',
    12: '26',
    13: '27-29',
    14: '30',
    15: '31',
    16: '32',
    17: '33',
    18: '34',
    19: '35'
  };

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
    r.toSoTrangSo = ranges19P[num];
    r.ghiChu = '';

    // Fixes
    if (fn === '004.jpg') {
      r.soKyHieuVanBan = '01/HĐ-THKC';
      r.ngayThangVanBan = '2019';
    }
    if (fn === '005.jpg') r.ngayThangVanBan = '04/03/2019';

    activeRows.push(r);
  }

  job.data.rows = activeRows;
  job.data.tongSoToText = `Bản mục lục này gồm ${pad(activeRows.length)} văn bản, 35 tờ`;

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

  const excelOut1 = path.join(DA_CHECK_DIR, 'PL_2019_19P.xlsx');
  const excelOut2 = path.join(OUTPUT_OCR_DIR, 'PL_2019_19P.xlsx');
  await exportJsonToExcel(job, excelOut1);
  await exportJsonToExcel(job, excelOut2);
  console.log(`Exported 19P to:\n  - ${excelOut1}\n  - ${excelOut2}`);
}

async function run() {
  await process19O();
  await process19P();
  console.log('\n>>> BATCH 2019-7 (19O & 19P) COMPLETE!');
}

run().catch(err => {
  console.error('Fatal error in batch 7:', err);
  process.exit(1);
});
