import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// Helper to assign continuous sheet numbers
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
// 1. PROCESS PL_2021_21a
// ==========================================
async function process21a() {
  console.log('\n>>> PROCESSING PL_2021_21a...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21a.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // Observed starts from 100% visual inspection of collages
  const visualStarts = {
    1: 1, 2: 3, 3: 5, 4: 7, 5: 9, 6: 10, 7: 12, 8: 18, 9: 19, 10: 20, 11: 21, 12: 22, 13: 27, 14: 28, 15: 30,
    16: 33, 17: 35, 18: 36, 19: 37, 20: 38, 21: 39, 22: 40, 23: 41, 24: 42, 25: 43, 26: 44, 27: 45, 28: 46, 29: 47, 30: 48, 31: 50,
    32: 51, 33: 51, 34: 52, 35: 53, 36: 54, 37: 55, 38: 56, 39: 57, 40: 61, 41: 63, 42: 64, 43: 65, 44: 66, 45: 67, 46: 68, 47: 69,
    48: 70, 49: 71, 50: 72, 51: 73, 52: 74, 53: 75, 54: 76, 55: 77, 56: 79, 57: 81, 58: 82, 59: 87, 60: 88, 61: 89, 62: 90, 63: 91,
    64: 92, 65: 93, 66: 94, 67: 95, 68: 96, 69: 97, 70: 98, 71: 99, 72: 100, 73: 101, 74: 102, 75: 103, 76: 104, 77: 105, 78: 107, 79: 109,
    80: 110, 81: 115, 82: 119, 83: 123, 84: 125, 85: 126, 86: 127, 87: 128, 88: 130, 89: 131, 90: 132, 91: 133, 92: 134, 93: 136, 94: 137, 95: 138,
    96: 139, 97: 140, 98: 141, 99: 142, 100: 143, 101: 147, 102: 148, 103: 149, 104: 151, 105: 153, 106: 158, 107: 159, 108: 160, 109: 161, 110: 162, 111: 163,
    112: 166, 113: 168, 114: 169, 115: 170, 116: 171, 117: 172, 118: 173, 119: 174, 120: 175, 121: 176, 122: 177, 123: 180, 124: 181, 125: 182, 126: 183, 127: 184,
    128: 185, 129: 186, 130: 187, 131: 188, 132: 189, 133: 190, 134: 191, 135: 195, 136: 196, 137: 197, 138: 198, 139: 199, 140: 203, 141: 210, 142: 211, 143: 212,
    144: 215, 145: 215, 146: 216, 147: 217, 148: 218, 149: 219, 150: 220, 151: 221, 152: 223, 153: 225, 154: 226, 155: 227, 156: 228, 157: 228, 158: 229, 159: 230,
    160: 231, 161: 231, 162: 232, 163: 233, 164: 234, 165: 235, 166: 236, 167: 237, 168: 238, 169: 239, 170: 240, 171: 241, 172: 242, 173: 243, 174: 244, 175: 245,
    176: 246, 177: 248
  };

  const starts = [null];
  let cur = 1;
  for (let i = 1; i <= 177; i++) {
    let val = visualStarts[i];
    if (val === undefined || val < cur) val = cur;
    const maxAllowed = 248 - (177 - i);
    if (val > maxAllowed) val = maxAllowed;
    starts.push(val);
    cur = val + 1;
  }
  starts.push(null); // idx 178 is 179.jpg (Trùng)

  const maxSheet = 248;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ quyết định đi (quý II) của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21a';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 02/04/2021 đến ngày 30/06/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.data.rowsTrung = [];

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      // 001.jpg cover
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else if (idx === 178) {
      // 179.jpg: handwritten "Trùng LL" at top right
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '248';
      row.ghiChu = 'Trùng hs PL_2021_21a';
      job.data.rowsTrung.push({ ...row });
    } else {
      img.isExcluded = false;
      img.status = 'active';
      row.toSoTrangSo = sheetRanges[idx];
    }
  });

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.name === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 248 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21a.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21a.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21a.xlsx'));
  console.log('Exported 21a Da_check:', res1);
  console.log('Exported 21a PL_outputOCR:', res2);

  // Sync duplicate 179.jpg to Tl_loại_VP_Toàn_PL.xlsx
  console.log('Checking trùng documents of 21a in Tl_loại_VP_Toàn_PL.xlsx...');
  const ExcelJS = (await import('exceljs')).default;
  const wbTl = new ExcelJS.Workbook();
  const tlPath = path.join(DA_CHECK_DIR, 'Tl_loại_VP_Toàn_PL.xlsx');
  await wbTl.xlsx.readFile(tlPath);
  const wsTr = wbTl.getWorksheet('Trùng');
  let has65 = false;
  wsTr.eachRow((r) => {
    const val = (r.getCell(3).value || '').toString();
    if (val.includes('65/QĐ-UBND') && val.includes('06/04/2021')) has65 = true;
  });

  if (!has65) {
    await appendTaiLieuLoai({
      type: 'trung',
      tenVanBan: 'Quyết định số 65/QĐ-UBND ngày 06/04/2021 về việc phê duyệt chủ trương đầu tư dự án Đường Ông Ba Lộc Đến Ông Đặng Nam Ấp 2',
      soHoSo: 'PL_2021_21a',
      thbq: 'Vĩnh viễn'
    });
    console.log('Appended 65/QĐ-UBND to Tl_loại_VP_Toàn_PL.xlsx');
  } else {
    console.log('65/QĐ-UBND already present in Tl_loại_VP_Toàn_PL.xlsx');
  }
}

// ==========================================
// 2. PROCESS PL_2021_21b
// ==========================================
async function process21b() {
  console.log('\n>>> PROCESSING PL_2021_21b...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21b.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // Filter OCR starts with realistic monotonicity
  const rawStarts = {};
  job.data.rows.forEach((r, idx) => {
    if (idx === 0 || idx >= 329) return;
    const num = parseInt(r.toSoTrangSo, 10);
    if (!isNaN(num)) {
      const offset = num - idx;
      const expectedOffset = idx * (30 / 328);
      if (offset >= 0 && offset <= 35 && Math.abs(offset - expectedOffset) <= 8) {
        rawStarts[idx] = num;
      }
    }
  });

  rawStarts[1] = 1;
  rawStarts[325] = 353; // 326.jpg
  rawStarts[326] = 354; // 327.jpg
  rawStarts[327] = 356; // 328.jpg
  rawStarts[328] = 358; // 329.jpg

  const starts = [null];
  let cur = 1;
  for (let i = 1; i <= 328; i++) {
    let val = rawStarts[i];
    if (val === undefined || val < cur) val = cur;
    const maxAllowed = 358 - (328 - i);
    if (val > maxAllowed) val = maxAllowed;
    starts.push(val);
    cur = val + 1;
  }
  starts.push(null); // idx 329 is 330.jpg (Trùng)
  starts.push(null); // idx 330 is 331.jpg (Trùng)

  const maxSheet = 358;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ công văn đi của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21b';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 05/01/2021 đến ngày 29/12/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.data.rowsTrung = [];

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      // 001.jpg cover
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else if (idx === 329) {
      // 330.jpg: handwritten "Trùng"
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '358';
      row.ghiChu = 'Trùng hs PL_2021_21b';
      row.tenLoaiTrichYeu = 'Công văn về việc ý kiến tham vấn về dự án "Xây dựng trang trại chăn nuôi heo thịt, quy mô 2.000 con", ông Phạm Văn Dũng';
      job.data.rowsTrung.push({ ...row });
    } else if (idx === 330) {
      // 331.jpg: handwritten "Trùng"
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '358';
      row.ghiChu = 'Trùng hs PL_2021_21b';
      row.tenLoaiTrichYeu = 'Công văn về việc đề nghị UBND huyện Tân Phú chỉ đạo dọn tán cây sao dọc tuyến đường Tà Lài trên địa bàn xã Phú Lộc';
      job.data.rowsTrung.push({ ...row });
    } else {
      img.isExcluded = false;
      img.status = 'active';
      row.toSoTrangSo = sheetRanges[idx];
    }
  });

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.name === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 358 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21b.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21b.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21b.xlsx'));
  console.log('Exported 21b Da_check:', res1);
  console.log('Exported 21b PL_outputOCR:', res2);

  // Sync 2 duplicates of 21b to Tl_loại_VP_Toàn_PL.xlsx
  console.log('Checking trùng documents of 21b in Tl_loại_VP_Toàn_PL.xlsx...');
  const ExcelJS = (await import('exceljs')).default;
  const wbTl = new ExcelJS.Workbook();
  const tlPath = path.join(DA_CHECK_DIR, 'Tl_loại_VP_Toàn_PL.xlsx');
  await wbTl.xlsx.readFile(tlPath);
  const wsTr = wbTl.getWorksheet('Trùng');
  let has253 = false;
  let has248 = false;
  wsTr.eachRow((r) => {
    const val = (r.getCell(3).value || '').toString();
    if (val.includes('253/UBND') && val.includes('14/06/2021')) has253 = true;
    if (val.includes('248/UBND') && val.includes('07/06/2021')) has248 = true;
  });

  if (!has253) {
    await appendTaiLieuLoai({
      type: 'trung',
      tenVanBan: 'Công văn số 253/UBND ngày 14/06/2021 về việc ý kiến tham vấn về dự án "Xây dựng trang trại chăn nuôi heo thịt, quy mô 2.000 con", ông Phạm Văn Dũng',
      soHoSo: 'PL_2021_21b',
      thbq: 'Vĩnh viễn'
    });
    console.log('Appended 253/UBND to Tl_loại_VP_Toàn_PL.xlsx');
  } else {
    console.log('253/UBND already present in Tl_loại_VP_Toàn_PL.xlsx');
  }

  if (!has248) {
    await appendTaiLieuLoai({
      type: 'trung',
      tenVanBan: 'Công văn số 248/UBND ngày 07/06/2021 về việc đề nghị UBND huyện Tân Phú chỉ đạo dọn tán cây sao dọc tuyến đường Tà Lài trên địa bàn xã Phú Lộc',
      soHoSo: 'PL_2021_21b',
      thbq: 'Vĩnh viễn'
    });
    console.log('Appended 248/UBND to Tl_loại_VP_Toàn_PL.xlsx');
  } else {
    console.log('248/UBND already present in Tl_loại_VP_Toàn_PL.xlsx');
  }
}

async function run() {
  await process21a();
  await process21b();
  console.log('\n=== ALL BATCH 1 (2021) DOSSIERS SUCCESSFULLY PROCESSED ===');
}

run().catch(err => {
  console.error('Error running batch 1 2021:', err);
  process.exit(1);
});
