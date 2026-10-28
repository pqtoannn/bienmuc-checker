import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const pad = (n) => String(n).padStart(2, '0');

// ==========================================
// 1. PROCESS PL_2019_19K
// ==========================================
async function process19K() {
  console.log('\n>>> PROCESSING PL_2019_19K...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19K.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Thông báo năm 2019 xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19K';
  job.data.soKyHieuHoSo = 'PL_2019_19K';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2019';
  job.data.thoiGianHoSo = 'Từ ngày 03/01/2019 đến ngày 31/12/2019';
  job.data.thbq = 'Vĩnh viễn';

  const starts19K = {
    2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 8, 9: 9, 10: 10,
    11: 12, 12: 13, 13: 14, 14: 15, 15: 16, 16: 17, 17: 19, 18: 20, 19: 21, 20: 22,
    21: 23, 22: 25, 23: 26, 24: 27, 25: 28, 26: 30, 27: 31, 28: 32, 29: 33, 30: 34,
    31: 35, 32: 36, 33: 37, 34: 38, 35: 39, 36: 40, 37: 41, 38: 42, 39: 43, 40: 44,
    41: 45, 42: 48, 43: 50, 44: 51, 45: 52, 46: 54, 47: 55, 48: 56, 49: 57, 50: 59,
    51: 60, 52: 61, 53: 63, 54: 64, 55: 65, 56: 67, 57: 72, 58: 73, 59: 74, 60: 75,
    61: 76, 62: 77, 63: 78, 64: 79, 65: 81, 66: 83, 67: 84, 68: 85, 69: 87, 70: 88,
    71: 89, 72: 90, 73: 92, 74: 93, 75: 95, 76: 97, 77: 98, 78: 99, 79: 100, 80: 101,
    81: 103, 82: 104, 83: 105, 84: 106, 85: 107, 86: 108, 87: 110, 88: 111, 89: 113, 90: 114,
    91: 115, 92: 116, 93: 118, 94: 120, 95: 121, 96: 126, 97: 127, 98: 129, 99: 131
  };

  const keys = Object.keys(starts19K).map(Number).sort((a,b)=>a-b);
  const ranges = {};
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const s = starts19K[k];
    let e;
    if (i < keys.length - 1) {
      e = starts19K[keys[i + 1]] - 1;
    } else {
      e = 131;
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

    // Verified specific corrections
    if (fn === '010.jpg') {
      r.soKyHieuVanBan = '07/TB-UBND';
      r.ngayThangVanBan = '30/01/2019';
    }
    if (fn === '012.jpg') {
      r.soKyHieuVanBan = '10/TB-UBND';
      r.ngayThangVanBan = '25/02/2019';
    }
    if (fn === '018.jpg') {
      r.soKyHieuVanBan = '16/TB-UBND';
      r.ngayThangVanBan = '22/03/2019';
    }
    if (fn === '022.jpg') r.soKyHieuVanBan = '19A/TB-UBND';
    if (fn === '025.jpg') r.soKyHieuVanBan = '22/TB-UBND';
    if (fn === '026.jpg') r.soKyHieuVanBan = '23/TB-UBND';
    if (fn === '027.jpg') r.soKyHieuVanBan = '24/TB-UBND';
    if (fn === '028.jpg') r.soKyHieuVanBan = '25/TB-UBND';
    if (fn === '029.jpg') r.soKyHieuVanBan = '26/TB-UBND';
    if (fn === '030.jpg') r.soKyHieuVanBan = '27/TB-UBND';
    if (fn === '031.jpg') r.soKyHieuVanBan = '28/TB-UBND';
    if (fn === '032.jpg') r.soKyHieuVanBan = '29/TB-UBND';
    if (fn === '033.jpg') r.soKyHieuVanBan = '30/TB-UBND';
    if (fn === '034.jpg') r.soKyHieuVanBan = '31/TB-UBND';
    if (fn === '035.jpg') r.soKyHieuVanBan = '32/TB-UBND';
    if (fn === '036.jpg') r.soKyHieuVanBan = '33/TB-UBND';
    if (fn === '037.jpg') r.soKyHieuVanBan = '34/TB-UBND';
    if (fn === '038.jpg') r.soKyHieuVanBan = '35/TB-BCĐ';
    if (fn === '039.jpg') r.soKyHieuVanBan = '36/TB-UBND';
    if (fn === '040.jpg') r.soKyHieuVanBan = '37/TB-UBND';
    if (fn === '043.jpg') r.soKyHieuVanBan = '39/TB-UBND';
    if (fn === '045.jpg') r.soKyHieuVanBan = '40A/TB-UBND';
    if (fn === '068.jpg') r.soKyHieuVanBan = '63/TB-UBND';
    if (fn === '075.jpg') r.soKyHieuVanBan = '70/TB-HĐ.NVQS';
    if (fn === '087.jpg') r.soKyHieuVanBan = '82/TB-UBND';
    if (fn === '096.jpg') r.soKyHieuVanBan = '92/TB-UBND';
    if (fn === '098.jpg') {
      r.soKyHieuVanBan = '94/TB-UBND';
      r.ngayThangVanBan = '31/12/2019';
    }

    activeRows.push(r);
  }

  job.data.rows = activeRows;
  job.data.tongSoToText = `Bản mục lục này gồm ${pad(activeRows.length)} văn bản, 131 tờ`;

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

  const excelOut1 = path.join(DA_CHECK_DIR, 'PL_2019_19K.xlsx');
  const excelOut2 = path.join(OUTPUT_OCR_DIR, 'PL_2019_19K.xlsx');
  await exportJsonToExcel(job, excelOut1);
  await exportJsonToExcel(job, excelOut2);
  console.log(`Exported 19K to:\n  - ${excelOut1}\n  - ${excelOut2}`);
}

// ==========================================
// 2. PROCESS PL_2019_19L
// ==========================================
async function process19L() {
  console.log('\n>>> PROCESSING PL_2019_19L...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19L.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Hồ sơ khen thưởng năm 2019 xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19L';
  job.data.soKyHieuHoSo = 'PL_2019_19L';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2019';
  job.data.thoiGianHoSo = 'Từ ngày 20/03/2019 đến ngày 26/12/2019';
  job.data.thbq = 'Vĩnh viễn';

  const ranges19L = {
    2: '01-02',
    3: '03-04',
    4: '05-06',
    5: '07-08',
    6: '09-11',
    7: '12-13',
    8: '14-15',
    9: '16-21',
    10: '22-25',
    11: '26-27',
    12: '28-29',
    13: '30'
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
    r.toSoTrangSo = ranges19L[num];
    r.ghiChu = '';

    // Verified specific corrections
    if (fn === '006.jpg') r.soKyHieuVanBan = '07/QĐ-UBND';
    if (fn === '010.jpg') {
      r.soKyHieuVanBan = '11/QĐ-UBND';
      r.ngayThangVanBan = '01/11/2019';
      r.tenLoaiTrichYeu = 'Quyết định về việc tặng giấy khen cho các cá nhân có thành tích xuất sắc trong phong trào "Toàn dân đoàn kết xây dựng đời sống văn hóa ở khu dân cư" năm 2019';
    }

    activeRows.push(r);
  }

  job.data.rows = activeRows;
  job.data.tongSoToText = `Bản mục lục này gồm ${pad(activeRows.length)} văn bản, 30 tờ`;

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

  const excelOut1 = path.join(DA_CHECK_DIR, 'PL_2019_19L.xlsx');
  const excelOut2 = path.join(OUTPUT_OCR_DIR, 'PL_2019_19L.xlsx');
  await exportJsonToExcel(job, excelOut1);
  await exportJsonToExcel(job, excelOut2);
  console.log(`Exported 19L to:\n  - ${excelOut1}\n  - ${excelOut2}`);
}

async function run() {
  await process19K();
  await process19L();
  console.log('\n>>> BATCH 2019-5 (19K & 19L) COMPLETE!');
}

run().catch(err => {
  console.error('Fatal error in batch 5:', err);
  process.exit(1);
});
