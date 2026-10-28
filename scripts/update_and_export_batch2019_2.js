import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const pad = (n) => String(n).padStart(2, '0');

// ==========================================
// 1. PROCESS PL_2019_19C
// ==========================================
async function process19C() {
  console.log('\n>>> PROCESSING PL_2019_19C...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19C.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Hồ sơ quyết định xử phạt vi phạm hành chính, biên bản năm 2019 xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19C';
  job.data.soKyHieuHoSo = 'PL_2019_19C';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.namGiaiDoan = '2019';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.tongSoToText = 'Gồm: 02 tờ';

  // 3 images: 001 is cover note slip (skip)
  job.images = [
    { fileName: '001.jpg', status: 'skip', isExcluded: true },
    { fileName: '002.jpg', status: 'active', isExcluded: false },
    { fileName: '003.jpg', status: 'active', isExcluded: false }
  ];

  const activeRows = [
    {
      soTT: '1',
      soKyHieuVanBan: '01/QĐ-XPHC',
      ngayThangVanBan: '29/07/2019',
      tenLoaiTrichYeu: 'Quyết định xử phạt vi phạm hành chính trong lĩnh vực đất đai đối với ông Võ Quang Hiệp',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '01',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['002.jpg']
    },
    {
      soTT: '2',
      soKyHieuVanBan: '',
      ngayThangVanBan: '13/08/2018',
      tenLoaiTrichYeu: 'Biên bản về việc kết thúc thông báo mất giấy trang bổ sung trên giấy CNQSD đất số BB 992027 của ông Hồ Hải Hưng thường trú tại ấp 2 xã Phú Lộc - huyện Tân phú - tỉnh Đồng Nai',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '02',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['003.jpg']
    }
  ];

  job.data.rows = activeRows;
  job.data.rowsTrung = [];
  job.updatedAt = new Date().toISOString();
  job.exportedAt = new Date().toISOString();
  job.exportedFileName = 'PL_2019_19C.xlsx';

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  // Export to Excel
  const outDaCheck = path.join(DA_CHECK_DIR, 'PL_2019_19C.xlsx');
  const outOutputOCR = path.join(OUTPUT_OCR_DIR, 'PL_2019_19C.xlsx');

  await exportJsonToExcel(job, outDaCheck);
  fs.copyFileSync(outDaCheck, outOutputOCR);

  console.log(`Saved 19C Excel files successfully (${activeRows.length} rows, sheets 01-02)`);
}

// ==========================================
// 2. PROCESS PL_2019_19D
// ==========================================
async function process19D() {
  console.log('\n>>> PROCESSING PL_2019_19D...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19D.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Hồ sơ quyết định năm 2019 xã Phú Lộc (từ ngày 03/01/2019 đến ngày 24/12/2019)';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19D';
  job.data.soKyHieuHoSo = 'PL_2019_19D';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.namGiaiDoan = '2019';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.tongSoToText = 'Gồm: 168 tờ';

  // 92 images: 001 is cover (skip)
  job.images = [];
  for (let i = 1; i <= 92; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1);
    job.images.push({
      fileName: fn,
      status: isSkip ? 'skip' : 'active',
      isExcluded: isSkip
    });
  }

  const starts19D = {
    2: 1, 3: 4, 4: 5, 5: 6, 6: 8, 7: 9, 8: 10, 9: 11, 10: 12,
    11: 13, 12: 14, 13: 15, 14: 16, 15: 17, 16: 19, 17: 20, 18: 21, 19: 24, 20: 28,
    21: 29, 22: 30, 23: 31, 24: 32, 25: 33, 26: 34, 27: 35, 28: 50, 29: 51, 30: 55,
    31: 56, 32: 57, 33: 58, 34: 60, 35: 61, 36: 63, 37: 64, 38: 65, 39: 66, 40: 68,
    41: 71, 42: 72, 43: 74, 44: 79, 45: 80, 46: 88, 47: 90, 48: 96, 49: 97, 50: 98,
    51: 99, 52: 100, 53: 101, 54: 102, 55: 103, 56: 104, 57: 105, 58: 107, 59: 108, 60: 109,
    61: 110, 62: 116, 63: 117, 64: 118, 65: 119, 66: 120, 67: 121, 68: 122, 69: 123, 70: 124,
    71: 125, 72: 126, 73: 127, 74: 129, 75: 130, 76: 132, 77: 133, 78: 136, 79: 137, 80: 138,
    81: 140, 82: 141, 83: 153, 84: 155, 85: 156, 86: 157, 87: 158, 88: 160, 89: 161, 90: 164,
    91: 166, 92: 168
  };

  const keys = Object.keys(starts19D).map(Number).sort((a,b)=>a-b);
  const ranges19D = {};
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const s = starts19D[p];
    let e;
    if (i === keys.length - 1) {
      e = 168;
    } else {
      e = starts19D[keys[i + 1]] - 1;
    }
    ranges19D[p] = (s === e) ? pad(s) : `${pad(s)}-${pad(e)}`;
  }

  const activeRows = [];
  let rowIdx = 1;
  const originalRows = job.data.rows || [];

  for (let i = 2; i <= 92; i++) {
    const fnStr = String(i).padStart(3, '0') + '.jpg';
    const orig = originalRows.find(r => r.sourceFileNames && r.sourceFileNames.includes(fnStr)) || originalRows[i - 1] || {};

    let so = (orig.soKyHieuVanBan || '').trim();
    let ngay = (orig.ngayThangVanBan || '').trim();
    let trichYeu = (orig.tenLoaiTrichYeu || '').trim();
    let tacGia = (orig.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc').trim();

    // Specific fix for 033.jpg
    if (i === 33) {
      ngay = '17/05/2019';
    }

    // Clean up duplicate spaces
    trichYeu = trichYeu.replace(/\s+/g, ' ');

    activeRows.push({
      soTT: String(rowIdx++),
      soKyHieuVanBan: so,
      ngayThangVanBan: ngay,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: ranges19D[i],
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
  job.exportedFileName = 'PL_2019_19D.xlsx';

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  // Export to Excel
  const outDaCheck = path.join(DA_CHECK_DIR, 'PL_2019_19D.xlsx');
  const outOutputOCR = path.join(OUTPUT_OCR_DIR, 'PL_2019_19D.xlsx');

  await exportJsonToExcel(job, outDaCheck);
  fs.copyFileSync(outDaCheck, outOutputOCR);

  console.log(`Saved 19D Excel files successfully (${activeRows.length} rows, sheets 01-168)`);
}

async function main() {
  await process19C();
  await process19D();
  console.log('\n========================================');
  console.log('BATCH 2019-2 PROCESSED AND EXPORTED SUCCESSFULLY!');
  console.log('========================================\n');
}

main().catch(err => {
  console.error('Fatal error processing Batch 2019-2:', err);
  process.exit(1);
});
