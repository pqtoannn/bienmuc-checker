import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// ==========================================
// 1. PROCESS PL_2020_20G
// ==========================================
async function process20G() {
  console.log('\n>>> PROCESSING PL_2020_20G...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20G.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 106 photos: 001 is cover, 106 is closing page of 105
  // Active documents: 002 to 105 (104 documents)
  const starts = {
    2: 1, 3: 2, 4: 3, 5: 10, 6: 11, 7: 15, 8: 16, 9: 17, 10: 18,
    11: 25, 12: 27, 13: 31, 14: 39, 15: 40, 16: 41, 17: 45, 18: 46, 19: 50, 20: 51,
    21: 56, 22: 60, 23: 65, 24: 66, 25: 70, 26: 73, 27: 74, 28: 76, 29: 80, 30: 81,
    31: 82, 32: 84, 33: 87, 34: 91, 35: 93, 36: 110, 37: 111, 38: 115, 39: 116, 40: 117,
    41: 119, 42: 126, 43: 127, 44: 130, 45: 131, 46: 132, 47: 135, 48: 136, 49: 139, 50: 140,
    51: 141, 52: 142, 53: 145, 54: 146, 55: 148, 56: 149, 57: 150, 58: 154, 59: 157, 60: 159,
    61: 161, 62: 162, 63: 168, 64: 172, 65: 173, 66: 176, 67: 179, 68: 181, 69: 183, 70: 192,
    71: 195, 72: 202, 73: 203, 74: 204, 75: 205, 76: 207, 77: 208, 78: 209, 79: 210, 80: 215,
    81: 216, 82: 217, 83: 218, 84: 220, 85: 222, 86: 223, 87: 229, 88: 231, 89: 232, 90: 233,
    91: 237, 92: 238, 93: 240, 94: 242, 95: 243, 96: 246, 97: 248, 98: 250, 99: 251, 100: 253,
    101: 255, 102: 258, 103: 260, 104: 261, 105: 266
  };

  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
  const pad = n => String(n).padStart(2, '0');
  const ranges = {};

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const cur = starts[p];
    if (p === 105) {
      ranges[p] = `${pad(cur)}-267`;
    } else {
      const nextP = keys[i + 1];
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

  job.images = [];
  for (let i = 1; i <= 106; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1 || i === 106);
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
    let soKyHieu = (r.soKyHieuVanBan || '').trim().replace(/^Số:?\s*/i, '');
    let ngayThang = (r.ngayThangVanBan || '').trim();
    let tacGia = (r.tacGiaVanBan || 'UBND xã Phú Lộc').trim();

    // Specific OCR corrections
    if (p === 8) soKyHieu = '06/BC-UBND';
    if (p === 65) soKyHieu = '56/BC-BCĐ';
    if (p === 77) soKyHieu = '67/BC-UBND';
    if (p === 91) soKyHieu = '81/BC-UBND';
    if (p === 99) soKyHieu = '88/BC-BCĐ';

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: ngayThang,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: ranges[p],
      loaiBan: r.loaiBan || 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: [fn]
    });
  }

  job.data.tenHoSo = 'Hồ sơ báo cáo của Ủy ban nhân dân xã Phú Lộc năm 2020';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Định Quán';
  job.data.donVi = 'UBND xã Phú Lộc';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Từ ngày 03/01/2020 đến ngày 30/06/2020';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 267 tờ`;
  job.data.thbq = 'Vĩnh viễn';
  job.data.banTo = 'Văn phòng';
  job.data.rows = activeRows;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  const excelDaCheck = path.join(DA_CHECK_DIR, 'PL_2020_20G.xlsx');
  const excelOcr = path.join(OUTPUT_OCR_DIR, 'PL_2020_20G.xlsx');
  await exportJsonToExcel(job.data, excelDaCheck);
  await exportJsonToExcel(job.data, excelOcr);
  console.log(`Saved 20G Excel files successfully (${activeRows.length} rows, sheets 01-267)`);
}

// ==========================================
// 2. PROCESS PL_2020_20H
// ==========================================
async function process20H() {
  console.log('\n>>> PROCESSING PL_2020_20H...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20H.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 79 photos: 001 is cover
  // Active documents: 002 to 079 (78 documents)
  const starts = {
    2: 1, 3: 2, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10,
    11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 20, 19: 21, 20: 22,
    21: 23, 22: 24, 23: 25, 24: 26, 25: 27, 26: 28, 27: 29, 28: 30, 29: 34, 30: 39,
    31: 40, 32: 41, 33: 42, 34: 43, 35: 44, 36: 45, 37: 47, 38: 48, 39: 49, 40: 50,
    41: 51, 42: 52, 43: 53, 44: 54, 45: 55, 46: 56, 47: 57, 48: 58, 49: 59, 50: 60,
    51: 61, 52: 62, 53: 63, 54: 64, 55: 65, 56: 69, 57: 70, 58: 71, 59: 72, 60: 73,
    61: 78, 62: 79, 63: 80, 64: 81, 65: 84, 66: 86, 67: 88, 68: 92, 69: 93, 70: 94,
    71: 95, 72: 96, 73: 97, 74: 98, 75: 99, 76: 100, 77: 101, 78: 102, 79: 103
  };

  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
  const pad = n => String(n).padStart(2, '0');
  const ranges = {};

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const cur = starts[p];
    if (p === 79) {
      ranges[p] = pad(cur);
    } else {
      const nextP = keys[i + 1];
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

  job.images = [];
  for (let i = 1; i <= 79; i++) {
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
    let soKyHieu = (r.soKyHieuVanBan || '').trim().replace(/^Số:?\s*/i, '');
    let ngayThang = (r.ngayThangVanBan || '').trim();
    let tacGia = (r.tacGiaVanBan || 'UBND xã Phú Lộc').trim();

    // Specific OCR corrections from visual inspection:
    if (p === 8) {
      soKyHieu = '07/TB-UBND';
      ngayThang = '07/02/2020';
    }
    if (p === 10) {
      soKyHieu = '20/BC - UBND';
      ngayThang = '04/03/2020';
    }
    if (p === 51) {
      soKyHieu = '47/TB-UBND';
      ngayThang = '28/08/2020';
    }
    if (p === 65) {
      soKyHieu = '61/TB-HĐ.GDQP&AN';
      ngayThang = '06/11/2020';
    }

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: ngayThang,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: ranges[p],
      loaiBan: r.loaiBan || 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: [fn]
    });
  }

  job.data.tenHoSo = 'Hồ sơ thông báo của Ủy ban nhân dân xã Phú Lộc năm 2020';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Định Quán';
  job.data.donVi = 'UBND xã Phú Lộc';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Từ ngày 08/01/2020 đến ngày 31/12/2020';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 103 tờ`;
  job.data.thbq = 'Vĩnh viễn';
  job.data.banTo = 'Văn phòng';
  job.data.rows = activeRows;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  const excelDaCheck = path.join(DA_CHECK_DIR, 'PL_2020_20H.xlsx');
  const excelOcr = path.join(OUTPUT_OCR_DIR, 'PL_2020_20H.xlsx');
  await exportJsonToExcel(job.data, excelDaCheck);
  await exportJsonToExcel(job.data, excelOcr);
  console.log(`Saved 20H Excel files successfully (${activeRows.length} rows, sheets 01-103)`);
}

async function main() {
  await process20G();
  await process20H();
  console.log('\n========================================');
  console.log('BATCH 2020-4 PROCESSED AND EXPORTED SUCCESSFULLY!');
  console.log('========================================');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
