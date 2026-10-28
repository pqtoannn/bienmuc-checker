import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// ==========================================
// 1. PROCESS PL_2020_20E
// ==========================================
async function process20E() {
  console.log('\n>>> PROCESSING PL_2020_20E...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20E.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 10 photos: 001 is cover, 010 is closing table
  // 8 active documents: 002 to 009
  const starts = {
    2: 1,
    3: 5,
    4: 10,
    5: 13,
    6: 18,
    7: 21,
    8: 25,
    9: 28
  };

  const pad = n => String(n).padStart(2, '0');
  const ranges = {};
  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const cur = starts[p];
    if (p === 9) {
      ranges[p] = `${pad(cur)}-31`;
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

  job.images = [];
  for (let i = 1; i <= 10; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1 || i === 10);
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

    // Specific title normalizations
    if (p === 2) {
      soKyHieu = '01/QĐ-UBND';
      ngayThang = '06/01/2020';
      trichYeu = 'Quyết định về việc Tặng giấy khen cho tập thể và cá nhân có thành tích xuất sắc trong hoạt động HĐND năm 2019';
    }
    if (p === 3) {
      soKyHieu = '02/QĐ-UBND';
      ngayThang = '06/01/2020';
      trichYeu = 'Quyết định về việc Tặng giấy khen cá nhân có thành tích đột xuất trong công tác đấu tranh phòng chống tội phạm';
    }
    if (p === 4) {
      soKyHieu = '03/QĐ-UBND';
      ngayThang = '15/01/2020';
      trichYeu = 'Quyết định về việc Tặng giấy khen cho tập thể và cá nhân có thành tích xuất sắc trong công tác Đoàn và phong trào thanh thiếu nhi trong giữa nhiệm kỳ 2017-2022';
    }
    if (p === 5) {
      soKyHieu = '04/QĐ-UBND';
      ngayThang = '28/03/2020';
      trichYeu = 'Quyết định về việc tặng giấy khen cho tập thể, cá nhân Điển hình tiên tiến trong phong trào thi đua yêu nước giai đoạn 2015-2020';
    }
    if (p === 6) {
      soKyHieu = '05/QĐ-UBND';
      ngayThang = '30/03/2020';
      trichYeu = 'Quyết định về việc Tặng giấy khen cho tập thể và cá nhân có thành tích xuất sắc trong công tác tuyển gọi công dân nhập ngũ năm 2020';
    }
    if (p === 7) {
      soKyHieu = '06/QĐ-UBND';
      ngayThang = '18/06/2020';
      trichYeu = 'Quyết định về việc Tặng giấy khen cho 01 tập thể và 03 cá nhân có thành tích tiêu biểu trong tham gia học tập lớp huấn luyện Trung đội dân quân cơ động năm 2020';
    }
    if (p === 8) {
      soKyHieu = '07/QĐ-UBND';
      ngayThang = '29/10/2020';
      trichYeu = 'Quyết định về việc Tặng giấy khen cho 24 cá nhân và 03 tập thể có thành tích xuất sắc trong công tác bầu cử trưởng ấp lần thứ IX, nhiệm kỳ 2020 - 2025';
    }
    if (p === 9) {
      soKyHieu = '08/QĐ-UBND';
      ngayThang = '02/11/2020';
      trichYeu = 'Quyết định về việc Tặng giấy khen cho 09 cá nhân có thành tích trong phong trào “TDĐKXĐĐSVHỞKDC” năm 2020';
    }

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: ngayThang,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: ranges[p],
      loaiBan: r.loaiBan || 'Bản gốc',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: [fn]
    });
  }

  job.data.tenHoSo = 'Hồ sơ về quyết định khen thưởng của Ủy ban nhân dân xã Phú Lộc năm 2020';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Định Quán';
  job.data.donVi = 'UBND xã Phú Lộc';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Từ ngày 06/01/2020 đến ngày 02/11/2020';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 31 tờ`;
  job.data.thbq = 'Vĩnh viễn';
  job.data.banTo = 'Văn phòng';
  job.data.rows = activeRows;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  // Export to Excel
  const excelDaCheck = path.join(DA_CHECK_DIR, 'PL_2020_20E.xlsx');
  const excelOcr = path.join(OUTPUT_OCR_DIR, 'PL_2020_20E.xlsx');
  await exportJsonToExcel(job.data, excelDaCheck);
  await exportJsonToExcel(job.data, excelOcr);
  console.log(`Saved 20E Excel files successfully (${activeRows.length} rows, sheets 01-31)`);
}

// ==========================================
// 2. PROCESS PL_2020_20F
// ==========================================
async function process20F() {
  console.log('\n>>> PROCESSING PL_2020_20F...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20F.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const starts = {
    2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9,
    11: 10, 12: 12, 13: 13, 14: 14, 15: 15, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22,
    21: 23, 22: 24, 23: 25, 24: 26, 25: 27, 26: 29, 27: 30, 28: 31, 29: 32, 30: 33,
    31: 34, 32: 35, 33: 37, 34: 38, 35: 39, 36: 40, 37: 41, 38: 44, 39: 45, 40: 47,
    41: 48, 42: 49, 43: 53, 44: 54, 45: 57, 46: 59, 47: 60, 48: 61, 49: 63, 50: 64,
    51: 66, 52: 67, 53: 68, 54: 69, 55: 70, 56: 71, 57: 72,
    // 58 is SKIP (dup scan of 57)
    59: 73, 60: 74, 61: 75, 62: 76, 63: 77, 64: 78, 65: 79, 66: 80, 67: 81, 68: 82,
    69: 83, 70: 84, 71: 85, 72: 86, 73: 87, 74: 88, 75: 89, 76: 90, 77: 91, 78: 92,
    79: 93, 80: 94, 81: 95, 82: 96, 83: 97, 84: 98, 85: 100, 86: 101, 87: 103, 88: 104,
    89: 105, 90: 106, 91: 108, 92: 109, 93: 110, 94: 112, 95: 113, 96: 114, 97: 115, 98: 116,
    99: 117, 100: 118, 101: 119, 102: 120, 103: 121, 104: 123, 105: 124, 106: 125, 107: 126, 108: 127,
    109: 128, 110: 129, 111: 131, 112: 132, 113: 134, 114: 136, 115: 137, 116: 138, 117: 139, 118: 140,
    119: 141, 120: 142,
    // 121 is SKIP (dup scan of 120)
    122: 143, 123: 145, 124: 146, 125: 147, 126: 148, 127: 150, 128: 151, 129: 152, 130: 153,
    131: 154, 132: 155, 133: 156, 134: 157, 135: 158, 136: 159, 137: 160, 138: 161, 139: 162, 140: 163,
    141: 164, 142: 165, 143: 166, 144: 167, 145: 168, 146: 169, 147: 170, 148: 171, 149: 173,
    150: 174
    // 151 is SKIP (closing page of 150, ends at 176)
  };

  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
  const pad = n => String(n).padStart(2, '0');
  const ranges = {};

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const cur = starts[p];
    if (p === 150) {
      ranges[p] = `${pad(cur)}-176`;
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

  // Update images
  job.images = [];
  for (let i = 1; i <= 151; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1 || i === 58 || i === 121 || i === 151);
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
    if (p === 2) {
      soKyHieu = '01/UBND';
      ngayThang = '08/01/2020';
    }
    if (p === 118) {
      soKyHieu = '115/UBND';
      ngayThang = '05/11/2020';
    }
    if (p === 120) {
      soKyHieu = '116/PCTT-TKCN';
      ngayThang = '10/11/2020';
    }
    if (p === 150) {
      soKyHieu = '';
      ngayThang = '31/12/2020';
      trichYeu = 'Trích biên bản họp bình xét đề nghị khen thưởng tổng kết năm 2020';
      tacGia = 'UBND xã Phú Lộc - Hội đồng TĐKT';
    }

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: ngayThang,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: ranges[p],
      loaiBan: r.loaiBan || 'Bản gốc',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: [fn]
    });
  }

  job.data.tenHoSo = 'Hồ sơ công văn của Ủy ban nhân dân xã Phú Lộc năm 2020';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Định Quán';
  job.data.donVi = 'UBND xã Phú Lộc';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Từ ngày 08/01/2020 đến ngày 31/12/2020';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 176 tờ`;
  job.data.thbq = 'Vĩnh viễn';
  job.data.banTo = 'Văn phòng';
  job.data.rows = activeRows;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  // Export to Excel
  const excelDaCheck = path.join(DA_CHECK_DIR, 'PL_2020_20F.xlsx');
  const excelOcr = path.join(OUTPUT_OCR_DIR, 'PL_2020_20F.xlsx');
  await exportJsonToExcel(job.data, excelDaCheck);
  await exportJsonToExcel(job.data, excelOcr);
  console.log(`Saved 20F Excel files successfully (${activeRows.length} rows, sheets 01-176)`);
}

async function main() {
  await process20E();
  await process20F();
  console.log('\n========================================');
  console.log('BATCH 2020-3 PROCESSED AND EXPORTED SUCCESSFULLY!');
  console.log('========================================');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
