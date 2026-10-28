import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// Helper to assign continuous sheet ranges
function computeSheetRanges(starts, maxSheet) {
  const result = new Array(starts.length).fill('');
  for (let idx = 0; idx < starts.length; idx++) {
    const s = starts[idx];
    if (s === null || s === undefined) continue;

    let e = maxSheet;
    for (let next = idx + 1; next < starts.length; next++) {
      if (typeof starts[next] === 'number') {
        e = starts[next] - 1;
        break;
      }
    }
    result[idx] = (s === e) ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')}-${String(e).padStart(2, '0')}`;
  }
  return result;
}

// ==========================================
// 1. PROCESS PL_2020_20C
// ==========================================
async function process20C() {
  console.log('\n>>> PROCESSING PL_2020_20C...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20C.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 19 photos: 001.jpg is cover (skip)
  // 18 active documents: 002.jpg to 019.jpg, each 1 page (sheets 01 to 18)
  const starts = {};
  for (let i = 2; i <= 19; i++) {
    starts[i] = i - 1;
  }

  // Backup original
  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  job.images = [];
  for (let i = 1; i <= 19; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1);
    job.images.push({
      fileName: fn,
      status: isSkip ? 'skip' : 'active',
      isExcluded: isSkip
    });
  }

  const pad = n => String(n).padStart(2, '0');
  const activeRows = [];

  for (let i = 2; i <= 19; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const r = job.data.rows.find(row => row.sourceFileNames && row.sourceFileNames.includes(fn)) || job.data.rows[i - 1];

    let trichYeu = (r.tenLoaiTrichYeu || '').trim();
    trichYeu = trichYeu.replace(/^v\/v:?\s*/i, 'về việc ');
    let soKyHieu = (r.soKyHieuVanBan || '').trim().replace(/^Số:?\s*/i, '');
    let ngayThang = (r.ngayThangVanBan || '').trim();
    let tacGia = (r.tacGiaVanBan || 'UBND xã Phú Lộc').trim();

    // Specific corrections from visual inspection of 20C:
    if (i === 7) { // 007.jpg: 06/QĐ-XPHC
      ngayThang = '11/11/2020';
      if (!trichYeu.includes('Đặng Hồng Sơn')) {
        trichYeu = 'Quyết định về việc xử phạt vi phạm hành chính đối với ông Đặng Hồng Sơn';
      }
    }
    if (i === 9) { // 009.jpg: 08/QĐ-XPVPHC
      trichYeu = trichYeu.replace(/,\s*ông Nguyễn Tấn Hiệp.*$/i, '').trim();
    }
    if (i === 10) { // 010.jpg: 09/QĐ-XPVPHC
      trichYeu = trichYeu.replace(/,\s*ông Nguyễn Tấn Hiệp.*$/i, '').trim();
    }
    if (i === 11) { // 011.jpg: 10/QĐ-XPVPHC
      soKyHieu = '10/QĐ-XPVPHC';
      if (!trichYeu.includes('Nguyễn Thị Oanh')) {
        trichYeu = 'Quyết định về việc xử phạt vi phạm hành chính, bà Nguyễn Thị Oanh';
      }
    }
    if (i === 12) { // 012.jpg: 11/QĐ-XPVPHC
      soKyHieu = '11/QĐ-XPVPHC';
      ngayThang = '05/12/2020';
      if (!trichYeu.includes('Nguyễn Văn Đồng')) {
        trichYeu = 'Quyết định về việc xử phạt vi phạm hành chính, ông Nguyễn Văn Đồng';
      }
    }
    if (i === 18) { // 018.jpg: 17/QĐ-XPVPHC
      trichYeu = trichYeu.replace(/,\s*ông Nguyễn Tấn Hiệp.*$/i, '').trim();
    }

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: ngayThang,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: pad(starts[i]),
      loaiBan: r.loaiBan || 'Bản gốc',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: [fn]
    });
  }

  job.data.tenHoSo = 'Hồ sơ về quyết định xử phạt vi phạm hành chính của UBND xã Phú Lộc năm 2020';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Định Quán';
  job.data.donVi = 'UBND xã Phú Lộc';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Từ ngày 08/01/2020 đến ngày 29/12/2020';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 18 tờ`;
  job.data.thbq = 'Vĩnh viễn';
  job.data.banTo = 'Văn phòng';
  job.data.rows = activeRows;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  // Export to Excel
  const excelDaCheck = path.join(DA_CHECK_DIR, 'PL_2020_20C.xlsx');
  const excelOcr = path.join(OUTPUT_OCR_DIR, 'PL_2020_20C.xlsx');
  await exportJsonToExcel(job.data, excelDaCheck);
  await exportJsonToExcel(job.data, excelOcr);
  console.log(`Saved 20C Excel files successfully (${activeRows.length} rows, sheets 01-18)`);
}

// ==========================================
// 2. PROCESS PL_2020_20D
// ==========================================
async function process20D() {
  console.log('\n>>> PROCESSING PL_2020_20D...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20D.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const starts = {
    2: 1, 3: 3, 4: 4, 5: 7, 6: 9, 7: 11, 8: 12, 9: 13, 10: 14,
    11: 15, 12: 16, 13: 17, 14: 18, 15: 19, 16: 26, 17: 28, 18: 29, 19: 30, 20: 31,
    21: 32, 22: 33, 23: 34, 24: 35, 25: 36, 26: 37, 27: 38, 28: 39, 29: 40, 30: 41,
    31: 42, 32: 43, 33: 45, 34: 46, 35: 48, 36: 49, 37: 51, 38: 52, 39: 53, 40: 54,
    41: 55, 42: 56, 43: 57, 44: 58, 45: 59, 46: 60, 47: 61, 48: 62, 49: 63, 50: 64,
    51: 65, 52: 66, 53: 67, 54: 68, 55: 69, 56: 70, 57: 71, 58: 72, 59: 73, 60: 74,
    61: 75, 62: 76, 63: 77, 64: 78, 65: 79, 66: 80, 67: 81, 68: 82, 69: 83, 70: 84,
    71: 85, 72: 86, 73: 87, 74: 88, 75: 89, 76: 90, 77: 91, 78: 92, 79: 93, 80: 94,
    81: 95, 82: 97, 83: 98, 84: 102, 85: 105, 86: 108, 87: 111, 88: 121, 89: 125, 90: 127,
    91: 128, 92: 129, 93: 130, 94: 132, 95: 133, 96: 135, 97: 136, 98: 137, 99: 138, 100: 140,
    101: 141, 102: 142, 103: 143, 104: 145, 105: 146, 106: 147, 107: 148, 108: 149, 109: 151, 110: 165,
    111: 166, 112: 167, 113: 168, 114: 169, 115: 170, 116: 171, 117: 172, 118: 173, 119: 174, 120: 175,
    121: 176, 122: 177, 123: 178, 124: 179, 125: 180, 126: 181, 127: 182, 128: 183, 129: 184, 130: 185,
    131: 186, 132: 187, 133: 188, 134: 189, 135: 190, 136: 192, 137: 193, 138: 194, 139: 195, 140: 196,
    141: 197, 142: 198, 143: 199, 144: 200, 145: 201, 146: 202, 147: 203, 148: 204, 149: 205, 150: 206,
    151: 207, 152: 208, 153: 209, 154: 210, 155: 211, 156: 212, 157: 214, 158: 216, 159: 218, 160: 219,
    161: 220, 162: 222, 163: 223, 164: 226, 165: 227, 166: 228,
    // 167 is SKIP (dup scan of 166)
    168: 229, 169: 231, 170: 233, 171: 234, 172: 235, 173: 236, 174: 237, 175: 238, 176: 241,
    177: 243, 178: 244, 179: 247, 180: 248, 181: 250, 182: 252, 183: 253, 184: 254, 185: 255,
    186: 256, 187: 257, 188: 258, 189: 259, 190: 260, 191: 262, 192: 263, 193: 264,
    // Group 1 inserted decisions:
    194: 271, 195: 279, 196: 280, 197: 281, 198: 282, 199: 283, 200: 284, 201: 287,
    202: 288, 203: 290, 204: 292, 205: 294, 206: 296,
    // Group 2 continued after Group 1 (296 + 2 = 298):
    207: 298, // old 268
    208: 299, // old 269
    209: 301, // old 271
    210: 303, // old 273
    211: 305, // old 275
    212: 306, // old 276
    213: 308, // old 278
    214: 309, // old 279
    215: 311, // old 281
    216: 313, // old 283
    217: 314, // old 284
    218: 315, // old 285
    219: 316, // old 286
    220: 317, // old 287
    221: 319, // old 289
    // 222 is SKIP (dup scan of 221)
    223: 320, // old 290
    224: 321, // old 291
    225: 322  // old 292
  };

  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
  const pad = n => String(n).padStart(2, '0');
  const ranges = {};

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const cur = starts[p];
    if (i === keys.length - 1) {
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

  // Update images: 001 is skip (cover), 167 is skip (dup 166), 222 is skip (dup 221)
  job.images = [];
  for (let i = 1; i <= 225; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1 || i === 167 || i === 222);
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
    if (p === 6) {
      soKyHieu = '05/QĐ-UBND';
      ngayThang = '06/02/2020';
    }
    if (p === 7) {
      soKyHieu = '05/QĐ-UBND';
      ngayThang = '10/02/2020';
    }
    if (p === 8) {
      soKyHieu = '32/QĐ-UBND';
      ngayThang = '10/02/2020';
    }
    if (p === 10) {
      soKyHieu = '07/QĐ-UBND';
      ngayThang = '21/02/2020';
    }
    if (p === 11) {
      soKyHieu = '08/QĐ-UBND';
      ngayThang = '21/02/2020';
    }
    if (p === 33) {
      soKyHieu = '90/TTr-UBND';
      ngayThang = '';
    }
    if (p === 104) {
      soKyHieu = '101/QĐ-UBND';
    }
    if (p === 146) {
      soKyHieu = '142/QĐ-UBND';
    }
    if (p === 147) {
      soKyHieu = '143/QĐ-UBND';
    }
    if (p === 148) {
      soKyHieu = '144/QĐ-UBND';
    }
    if (p === 149) {
      soKyHieu = '145/QĐ-UBND';
    }
    if (p === 150) {
      soKyHieu = '146/QĐ-UBND';
    }
    if (p === 203) {
      soKyHieu = '195/QĐ-UBND';
    }
    if (p === 204) {
      soKyHieu = '196/QĐ-UBND';
    }
    if (p === 211) {
      soKyHieu = '202/QĐ-UBND';
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

  job.data.tenHoSo = 'Hồ sơ về quyết định của Ủy ban nhân dân xã Phú Lộc năm 2020';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Định Quán';
  job.data.donVi = 'UBND xã Phú Lộc';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Từ ngày 10/01/2020 đến ngày 30/12/2020';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 322 tờ`;
  job.data.thbq = 'Vĩnh viễn';
  job.data.banTo = 'Văn phòng';
  job.data.rows = activeRows;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  // Export to Excel
  const excelDaCheck = path.join(DA_CHECK_DIR, 'PL_2020_20D.xlsx');
  const excelOcr = path.join(OUTPUT_OCR_DIR, 'PL_2020_20D.xlsx');
  await exportJsonToExcel(job.data, excelDaCheck);
  await exportJsonToExcel(job.data, excelOcr);
  console.log(`Saved 20D Excel files successfully (${activeRows.length} rows, sheets 01-322)`);
}

async function main() {
  await process20C();
  await process20D();
  console.log('\n========================================');
  console.log('BATCH 2020-2 PROCESSED AND EXPORTED SUCCESSFULLY!');
  console.log('========================================');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
