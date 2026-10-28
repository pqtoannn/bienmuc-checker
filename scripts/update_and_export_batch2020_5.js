import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// ==========================================
// 1. PROCESS PL_2020_20I
// ==========================================
async function process20I() {
  console.log('\n>>> PROCESSING PL_2020_20I...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20I.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 108 photos: 001 is cover
  // Active documents: 002 to 108 (107 documents)
  const starts = {
    2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 11, 10: 14,
    11: 16, 12: 17, 13: 18, 14: 19, 15: 20, 16: 21, 17: 22, 18: 23, 19: 24, 20: 26,
    21: 27, 22: 28, 23: 30, 24: 33, 25: 34, 26: 37, 27: 40, 28: 41, 29: 44, 30: 46,
    31: 49, 32: 50, 33: 51, 34: 52, 35: 53, 36: 55, 37: 56, 38: 57, 39: 58, 40: 59,
    41: 60, 42: 62, 43: 63, 44: 64, 45: 65, 46: 67, 47: 69, 48: 72, 49: 74, 50: 76,
    51: 80, 52: 81, 53: 82, 54: 83, 55: 86, 56: 88, 57: 89, 58: 90, 59: 92, 60: 93,
    61: 94, 62: 98, 63: 99, 64: 101, 65: 103, 66: 105, 67: 108, 68: 109, 69: 110, 70: 111,
    71: 112, 72: 115, 73: 117, 74: 119, 75: 120, 76: 121, 77: 122, 78: 123, 79: 127, 80: 128,
    81: 129, 82: 132, 83: 133, 84: 135, 85: 136, 86: 137, 87: 138, 88: 140, 89: 142, 90: 145,
    91: 147, 92: 148, 93: 149, 94: 151, 95: 152, 96: 153, 97: 154, 98: 157, 99: 159, 100: 161,
    101: 162, 102: 163, 103: 165, 104: 167, 105: 169, 106: 170, 107: 172, 108: 173
  };

  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
  const pad = n => String(n).padStart(2, '0');
  const ranges = {};

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const cur = starts[p];
    if (p === 108) {
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
  for (let i = 1; i <= 108; i++) {
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

    // Specific OCR corrections
    if (p === 86) soKyHieu = '84/TTr-UBND';
    if (p === 92) soKyHieu = '91/TTr-UBND';
    if (p === 98) soKyHieu = '97/TTr-UBND';
    if (p === 108) {
      soKyHieu = '';
      tacGia = 'UBND xã Phú Lộc - Hội đồng TĐKT';
      ngayThang = '24/12/2020';
      trichYeu = 'Trích biên bản họp Đề nghị tặng thưởng Giấy khen của UBND Huyện Đạt thành tích xuất sắc trong công tác phòng chống tội phạm';
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

  job.data.tenHoSo = 'Hồ sơ tờ trình của Ủy ban nhân dân xã Phú Lộc năm 2020';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Định Quán';
  job.data.donVi = 'UBND xã Phú Lộc';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Từ ngày 08/01/2020 đến ngày 29/12/2020';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 173 tờ`;
  job.data.thbq = 'Vĩnh viễn';
  job.data.banTo = 'Văn phòng';
  job.data.rows = activeRows;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  const excelDaCheck = path.join(DA_CHECK_DIR, 'PL_2020_20I.xlsx');
  const excelOcr = path.join(OUTPUT_OCR_DIR, 'PL_2020_20I.xlsx');
  await exportJsonToExcel(job.data, excelDaCheck);
  await exportJsonToExcel(job.data, excelOcr);
  console.log(`Saved 20I Excel files successfully (${activeRows.length} rows, sheets 01-173)`);
}

// ==========================================
// 2. PROCESS PL_2020_20J
// ==========================================
async function process20J() {
  console.log('\n>>> PROCESSING PL_2020_20J...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20J.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 5 photos: 001 is cover note
  // 4 active documents: 002 to 005
  // Sheets: 002 -> 01-12, 003 -> 13-15, 004 -> 16, 005 -> 17
  const ranges = {
    2: '01-12',
    3: '13-15',
    4: '16',
    5: '17'
  };

  // Backup original
  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  job.images = [];
  for (let i = 1; i <= 5; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1);
    job.images.push({
      fileName: fn,
      status: isSkip ? 'skip' : 'active',
      isExcluded: isSkip
    });
  }

  const activeRows = [
    {
      soTT: '1',
      soKyHieuVanBan: '59/TB-UBND',
      ngayThangVanBan: '02/11/2020',
      tenLoaiTrichYeu: 'Thông báo về việc phân công nhiệm vụ tổ lấy ý kiến nhân dân đối với các chức danh công chức xã Phú Lộc năm 2020, ông Liêu Thế Vũ',
      tacGiaVanBan: 'UBND xã Phú Lộc',
      toSoTrangSo: ranges[2],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['002.jpg']
    },
    {
      soTT: '2',
      soKyHieuVanBan: '59/KH-UBND',
      ngayThangVanBan: '02/11/2020',
      tenLoaiTrichYeu: 'Kế hoạch về việc tổ chức lấy ý kiến nhân dân đối với các chức danh công chức xã Phú Lộc năm 2020',
      tacGiaVanBan: 'UBND xã Phú Lộc',
      toSoTrangSo: ranges[3],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['003.jpg']
    },
    {
      soTT: '3',
      soKyHieuVanBan: '191/QĐ-UBND',
      ngayThangVanBan: '02/11/2020',
      tenLoaiTrichYeu: 'Quyết định về việc thành lập tổ lấy ý kiến nhân dân đối với các chức danh công chức xã Phú Lộc năm 2020, ông Liêu Thế Vũ',
      tacGiaVanBan: 'UBND xã Phú Lộc',
      toSoTrangSo: ranges[4],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['004.jpg']
    },
    {
      soTT: '4',
      soKyHieuVanBan: '',
      ngayThangVanBan: '02/11/2020',
      tenLoaiTrichYeu: 'Danh sách công chức xã năm 2020',
      tacGiaVanBan: 'UBND xã Phú Lộc',
      toSoTrangSo: ranges[5],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['005.jpg']
    }
  ];

  job.data.tenHoSo = 'Hồ sơ lấy ý kiến nhân dân đối với các chức danh công chức xã của UBND xã Phú Lộc năm 2020';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Định Quán';
  job.data.donVi = 'UBND xã Phú Lộc';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Ngày 02/11/2020';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 17 tờ`;
  job.data.thbq = 'Vĩnh viễn';
  job.data.banTo = 'Văn phòng';
  job.data.rows = activeRows;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  const excelDaCheck = path.join(DA_CHECK_DIR, 'PL_2020_20J.xlsx');
  const excelOcr = path.join(OUTPUT_OCR_DIR, 'PL_2020_20J.xlsx');
  await exportJsonToExcel(job.data, excelDaCheck);
  await exportJsonToExcel(job.data, excelOcr);
  console.log(`Saved 20J Excel files successfully (${activeRows.length} rows, sheets 01-17)`);
}

async function main() {
  await process20I();
  await process20J();
  console.log('\n========================================');
  console.log('BATCH 2020-5 PROCESSED AND EXPORTED SUCCESSFULLY!');
  console.log('========================================');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
