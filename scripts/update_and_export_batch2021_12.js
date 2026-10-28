import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// ==========================================
// 1. PROCESS PL_2021_21Y
// ==========================================
async function process21Y() {
  console.log('\n>>> PROCESSING PL_2021_21Y...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21Y.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // Starts map for 105 documents
  const starts = {
    1: 1, 2: 13, 3: 15, 4: 23, 5: 25, 6: 27, 7: 29, 8: 31, 9: 33, 10: 34,
    11: 35, 12: 36, 13: 37, 14: 38, 15: 39, 16: 40, 17: 41, 18: 43, 19: 47, 20: 49,
    21: 51, 22: 57, 23: 59, 24: 62, 25: 64, 26: 66, 27: 68, 28: 71, 29: 73, 30: 76,
    31: 78, 32: 82, 33: 84, 34: 86, 35: 89, 36: 90, 37: 92, 38: 94, 39: 96, 40: 98,
    41: 99, 42: 100, 43: 103, 44: 105, 45: 107, 46: 109, 47: 111, 48: 113,
    49: 116, 50: 118, 51: 124, 52: 125, 53: 127, 54: 129, 55: 131, 56: 133, 57: 135, 58: 141,
    59: 143, 60: 146, 61: 149, 62: 153, 63: 155, 64: 157, 65: 159, 66: 162, 67: 164, 68: 166,
    69: 168, 70: 170, 71: 172, 72: 174, 73: 176, 74: 179, 75: 182, 76: 187, 77: 190, 78: 196,
    79: 202, 80: 208, 81: 210, 82: 211, 83: 212, 84: 215, 85: 222, 86: 229, 87: 236, 88: 243,
    89: 246, 90: 255, 91: 260, 92: 263, 93: 269, 94: 274, 95: 275, 96: 276, 97: 278, 98: 279,
    99: 280, 100: 281, 101: 285, 102: 289, 103: 292, 104: 293, 105: 311
  };

  const pad = (n) => String(n).padStart(2, '0');
  const ranges = {};
  for (let i = 1; i <= 105; i++) {
    const cur = starts[i];
    if (i === 105) {
      ranges[i] = pad(cur);
    } else {
      const next = starts[i + 1];
      if (next - 1 === cur) {
        ranges[i] = pad(cur);
      } else {
        ranges[i] = `${pad(cur)}-${pad(next - 1)}`;
      }
    }
  }

  // Backup original
  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  // All 105 photos active
  job.images = [];
  for (let i = 1; i <= 105; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    job.images.push({
      fileName: fn,
      status: 'active',
      isExcluded: false
    });
  }

  const activeRows = [];
  for (let i = 1; i <= 105; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const r = job.data.rows.find(row => row.sourceFileNames && row.sourceFileNames.includes(fn)) || job.data.rows[i - 1];

    // Clean trich yeu
    let trichYeu = (r.tenLoaiTrichYeu || '').trim();
    trichYeu = trichYeu.replace(/^v\/v:?\s*/i, 'về việc ');
    trichYeu = trichYeu.replace(/^về việc\s*/i, 'về việc ');

    // Normalize so ky hieu
    let soKyHieu = (r.soKyHieuVanBan || '').trim();
    soKyHieu = soKyHieu.replace(/^số:?\s*/i, '');

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: r.ngayThangVanBan || '',
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: r.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: ranges[i],
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: [fn]
    });
  }

  job.data.rows = activeRows;
  job.data.tenHoSo = 'Hồ sơ về công tác thi đua, khen thưởng của UBND xã Phú Lộc năm 2021 (Tập 01)';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21Y';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 16/11/2021 đến ngày 30/12/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';
  job.data.tapSo = '01';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 311 tờ`;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated PL_2021_21Y.job.json with ${activeRows.length} rows`);

  const exportData21Y = {
    ...job.data,
    rows: job.data.rows
  };

  const res1Y = await exportJsonToExcel(exportData21Y, path.join(DA_CHECK_DIR, 'PL_2021_21Y.xlsx'));
  const res2Y = await exportJsonToExcel(exportData21Y, path.join(OUTPUT_OCR_DIR, 'PL_2021_21Y.xlsx'));
  console.log('Exported 21Y Da_check:', res1Y);
  console.log('Exported 21Y PL_outputOCR:', res2Y);
}

// ==========================================
// 2. PROCESS PL_2021_21Z
// ==========================================
async function process21Z() {
  console.log('\n>>> PROCESSING PL_2021_21Z...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21Z.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 7 photos: all 7 are active
  // 1: 01
  // 2: 02-03
  // 3: 04-05
  // 4: 06-07
  // 5: 08-10
  // 6: 11-13
  // 7: 14-15
  const ranges = {
    1: '01',
    2: '02-03',
    3: '04-05',
    4: '06-07',
    5: '08-10',
    6: '11-13',
    7: '14-15'
  };

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  job.images = [];
  for (let i = 1; i <= 7; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    job.images.push({
      fileName: fn,
      status: 'active',
      isExcluded: false
    });
  }

  const activeRows = [
    {
      soTT: '1',
      soKyHieuVanBan: '',
      ngayThangVanBan: '10/01/2021',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc cho đại biểu có thành tích xuất sắc trong hoạt động năm 2021, ông Phan Văn Tuyền',
      tacGiaVanBan: 'HĐND xã Phú Lộc',
      toSoTrangSo: ranges[1],
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: ['001.jpg']
    },
    {
      soTT: '2',
      soKyHieuVanBan: '',
      ngayThangVanBan: '10/01/2021',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã năm 2021, ông Nguyễn Ngọc Tú',
      tacGiaVanBan: 'HĐND xã Phú Lộc',
      toSoTrangSo: ranges[2],
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: ['002.jpg']
    },
    {
      soTT: '3',
      soKyHieuVanBan: '',
      ngayThangVanBan: '11/01/2021',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen cho cá nhân có thành tích xuất sắc trong công tác hội CCB nhiệm kỳ 2017 - 2022, Phân hội 1 chi hội 3',
      tacGiaVanBan: 'Hội CCB xã Phú Lộc',
      toSoTrangSo: ranges[3],
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: ['003.jpg']
    },
    {
      soTT: '4',
      soKyHieuVanBan: '',
      ngayThangVanBan: '20/11/2021',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng giấy khen của Chủ tịch UBND xã, Chi Đoàn Mầm Non Phú Lộc',
      tacGiaVanBan: 'UBND xã Phú Lộc - Chi Đoàn Mầm Non',
      toSoTrangSo: ranges[4],
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: ['004.jpg']
    },
    {
      soTT: '5',
      soKyHieuVanBan: '03/TTr-HKH',
      ngayThangVanBan: '21/12/2021',
      tenLoaiTrichYeu: 'Tờ trình về việc khen thưởng cho các tập thể và cá nhân có thành tích xuất sắc trong công tác khuyến học, khuyến tài nhiệm kỳ 2016 - 2021',
      tacGiaVanBan: 'Hội Khuyến học xã Phú Lộc',
      toSoTrangSo: ranges[5],
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: ['005.jpg']
    },
    {
      soTT: '6',
      soKyHieuVanBan: '13/QĐ-UBND',
      ngayThangVanBan: '22/12/2021',
      tenLoaiTrichYeu: 'Quyết định về việc tặng giấy khen cho các tập thể, cá nhân có thành tích xuất sắc trong công tác khuyến học, khuyến tài nhiệm kỳ 2016-2021',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: ranges[6],
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: ['006.jpg']
    },
    {
      soTT: '7',
      soKyHieuVanBan: '',
      ngayThangVanBan: '22/12/2021',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã, ông Bùi Hữu Phú',
      tacGiaVanBan: 'UBND xã Phú Lộc - Ban CHQS xã',
      toSoTrangSo: ranges[7],
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: ['007.jpg']
    }
  ];

  job.data.rows = activeRows;
  job.data.tenHoSo = 'Hồ sơ về công tác thi đua, khen thưởng của UBND xã Phú Lộc năm 2021 (Tập 02)';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21Z';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 10/01/2021 đến ngày 22/12/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';
  job.data.tapSo = '02';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 15 tờ`;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated PL_2021_21Z.job.json with ${activeRows.length} rows`);

  const exportData21Z = {
    ...job.data,
    rows: job.data.rows
  };

  const res1Z = await exportJsonToExcel(exportData21Z, path.join(DA_CHECK_DIR, 'PL_2021_21Z.xlsx'));
  const res2Z = await exportJsonToExcel(exportData21Z, path.join(OUTPUT_OCR_DIR, 'PL_2021_21Z.xlsx'));
  console.log('Exported 21Z Da_check:', res1Z);
  console.log('Exported 21Z PL_outputOCR:', res2Z);
}

async function main() {
  await process21Y();
  await process21Z();
}

main().catch(console.error);
