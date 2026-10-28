import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const pad = (n) => String(n).padStart(2, '0');

async function process19I() {
  console.log('\n>>> PROCESSING PL_2019_19I...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19I.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Hồ sơ công văn đi năm 2019 (Quý III và IV) xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19I';
  job.data.soKyHieuHoSo = 'PL_2019_19I';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2019';
  job.data.thoiGianHoSo = 'Từ ngày 08/07/2019 đến ngày 28/12/2019';
  job.data.thbq = 'Vĩnh viễn';

  const gridStarts = {
    2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 8, 8: 9, 9: 10, 10: 11,
    11: 12, 12: 13, 13: 14, 14: 15, 15: 16, 16: 17, 17: 18, 18: 19, 19: 20, 20: 21,
    21: 22, 22: 23, 23: 24, 24: 25, 25: 26, 26: 27, 27: 28, 28: 29, 29: 30, 30: 31,
    31: 32, 32: 33, 33: 34, 34: 35, 35: 36, 36: 37, 37: 38, 38: 39, 39: 41, 40: 43,
    41: 44, 42: 45, 43: 47, 44: 48, 45: 49, 46: 50, 47: 51, 48: 52, 49: 53, 50: 54,
    51: 55, 52: 56, 53: 57, 54: 58, 55: 59, 56: 60, 57: 61, 58: 62, 59: 63, 60: 64,
    61: 65, 62: 66, 63: 67, 64: 68, 65: 69, 66: 70, 67: 71, 68: 72, 69: 73, 70: 74,
    71: 75, 72: 76, 73: 77, 74: 78, 75: 79, 76: 80, 77: 81, 78: 82, 79: 83, 80: 84,
    81: 85, 82: 86, 83: 87, 84: 88, 85: 89, 86: 90, 87: 91, 88: 92, 89: 93, 90: 94,
    91: 95, 92: 96, 93: 97, 94: 98, 95: 99, 96: 100, 97: 101, 98: 102, 99: 103, 100: 104,
    101: 105, 102: 106, 103: 107, 104: 108, 105: 109, 106: 110, 107: 111, 108: 112, 109: 113, 110: 114,
    111: 115, 112: 116, 113: 117, 114: 118, 115: 119, 116: 120, 117: 121, 118: 122, 119: 123, 120: 124,
    121: 125, 122: 126, 123: 127, 124: 128, 125: 129, 126: 130, 127: 131, 128: 133, 129: 134, 130: 135,
    131: 136, 132: 137, 133: 138, 134: 139, 135: 143, 136: 144, 137: 145, 138: 147, 139: 148, 140: 149,
    141: 151, 142: 152, 143: 153, 144: 154, 145: 155, 146: 156, 147: 157, 148: 158, 149: 159, 150: 160,
    151: 161, 152: 162, 153: 163, 154: 164, 155: 165, 156: 166, 157: 167, 158: 168, 159: 169, 160: 170,
    161: 173, 162: 174, 163: 175, 164: 176, 165: 177, 166: 178, 167: 179, 168: 180, 169: 181
  };

  const keys = Object.keys(gridStarts).map(Number).sort((a,b)=>a-b);
  const ranges = {};
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const s = gridStarts[k];
    let e;
    if (i < keys.length - 1) {
      e = gridStarts[keys[i + 1]] - 1;
    } else {
      e = 181;
    }
    ranges[k] = s === e ? pad(s) : `${pad(s)}-${pad(e)}`;
  }

  const activeRows = [];
  let sttCounter = 1;

  for (let i = 0; i < job.data.rows.length; i++) {
    const r = job.data.rows[i];
    const fn = r.sourceFileNames ? r.sourceFileNames[0] : (job.images[i] ? job.images[i].fileName : '');
    if (fn === '001.jpg' || i === 0) {
      // Skip cover
      continue;
    }

    const num = parseInt(fn.replace('.jpg', ''), 10);
    r.soTT = String(sttCounter++);
    r.toSoTrangSo = ranges[num];
    r.ghiChu = '';

    // Verified specific corrections
    if (fn === '018.jpg') r.ngayThangVanBan = '01/08/2019';
    if (fn === '022.jpg') r.soKyHieuVanBan = '439/UBND';
    if (fn === '027.jpg') r.ngayThangVanBan = '01/08/2019';
    if (fn === '029.jpg') r.soKyHieuVanBan = '446/UBND';
    if (fn === '030.jpg') r.soKyHieuVanBan = '447/UBND';
    if (fn === '031.jpg') r.soKyHieuVanBan = '448/UBND';
    if (fn === '125.jpg') r.ngayThangVanBan = '21/10/2019';
    if (fn === '152.jpg') r.soKyHieuVanBan = '571/UBND';
    if (fn === '153.jpg') r.soKyHieuVanBan = '572/UBND';
    if (fn === '155.jpg') r.soKyHieuVanBan = '574/UBND';
    if (fn === '158.jpg') r.soKyHieuVanBan = '577/UBND';
    if (fn === '159.jpg') r.soKyHieuVanBan = '578/UBND';
    if (fn === '164.jpg') r.soKyHieuVanBan = '583/UBND';
    if (fn === '166.jpg') r.ngayThangVanBan = '27/12/2019';
    if (fn === '167.jpg') {
      r.soKyHieuVanBan = '587/UBND';
      r.ngayThangVanBan = '28/12/2019';
    }
    if (fn === '168.jpg') {
      r.soKyHieuVanBan = '588/UBND';
      r.ngayThangVanBan = '28/12/2019';
    }
    if (fn === '169.jpg') {
      r.soKyHieuVanBan = '46/UBND';
      r.ngayThangVanBan = '2019';
    }

    activeRows.push(r);
  }

  job.data.rows = activeRows;
  job.data.tongSoToText = `Bản mục lục này gồm ${pad(activeRows.length)} văn bản, 181 tờ`;

  // Update images status
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

  const excelOut1 = path.join(DA_CHECK_DIR, 'PL_2019_19I.xlsx');
  const excelOut2 = path.join(OUTPUT_OCR_DIR, 'PL_2019_19I.xlsx');
  await exportJsonToExcel(job, excelOut1);
  await exportJsonToExcel(job, excelOut2);
  console.log(`Exported 19I to:\n  - ${excelOut1}\n  - ${excelOut2}`);
}

process19I().catch(err => {
  console.error('Error in process19I:', err);
  process.exit(1);
});
