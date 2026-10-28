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
// 1. PROCESS PL_2022_22B
// ==========================================
async function process22B() {
  console.log('\n>>> PROCESSING PL_2022_22B...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2022_22B.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const starts = [
    null, // 001 cover
    1, 3, 4, 5, 6, 7, 9, 10, 14, 15, 16, 25, 26, 38
  ];
  const maxSheet = 38;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ văn bản các loại đi của UBND xã Phú Lộc năm 2022';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2022_22B';
  job.data.namGiaiDoan = '2022';
  job.data.thoiGianHoSo = 'Từ ngày 18/01/2022 đến ngày 19/12/2022';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
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

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 38 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2022_22B.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2022_22B.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2022_22B.xlsx'));
  console.log('Exported 22B Da_check:', res1);
  console.log('Exported 22B PL_outputOCR:', res2);
}

// ==========================================
// 2. PROCESS PL_2022_22A
// ==========================================
async function process22A() {
  console.log('\n>>> PROCESSING PL_2022_22A...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2022_22A.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const starts = [
    null, // 001 cover
    1, 2, 3, 5, 12, 13, 21, 25, 27, 28, 29, 32, 37, 41, 42,
    45, 50, 52, 56, 57, 58, 61, 62, 64, 66, 71, 79, 90, 91, 92, 93,
    98, 99, 101, 104, 108, 112, 114, 115, 121, 124, 128, 130, 132, 136, 137, 139,
    140, // 049 (140-148)
    null, // 050 Trùng (159/BC-UBND, 149-150)
    null, // 051 Trùng (160/BC-UBND, 151)
    152, // 052 (152-154)
    155, // 053 (155)
    null, // 054 Duplicate scan of 053
    161, 165, 167, 169, 170, 176, 179, 182, 185, 186, 188, 189, 190, 191, 195, 200,
    202, 204, 207, 210, 211, 214, 216, 217, 218, 222, 224, 235, 236, 239, 241, 243,
    245, 253, 256, 257, 260, 261, 263, 265, 270, 271, 273, 276, 277, 280, 283, 284,
    287, 288, 289, 293, 296, 297, 298, 299, 303, 304, 307, 309, 311, 313,
    null // 117 Annex table of 116 (313-316)
  ];
  const maxSheet = 316;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ báo cáo đi (quý III và IV) của UBND xã Phú Lộc năm 2022';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2022_22A';
  job.data.namGiaiDoan = '2022';
  job.data.thoiGianHoSo = 'Từ ngày 04/07/2022 đến ngày 30/12/2022';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.data.rowsTrung = [];

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      // 001 cover
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else if (idx === 48) {
      // 049.jpg: 158/BC-UBND (sheets 140-148, before duplicate 050 at 149)
      img.isExcluded = false;
      img.status = 'active';
      row.toSoTrangSo = '140-148';
    } else if (idx === 49) {
      // 050.jpg: Trùng 159/BC-UBND
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '149-150';
      row.ghiChu = 'Trùng hs PL_2022_22A';
      job.data.rowsTrung.push({ ...row });
    } else if (idx === 50) {
      // 051.jpg: Trùng 160/BC-UBND
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '151';
      row.ghiChu = 'Trùng hs PL_2022_22A';
      job.data.rowsTrung.push({ ...row });
    } else if (idx === 53) {
      // 054.jpg: duplicate scan of 053
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else if (idx === 116) {
      // 117.jpg: Annex table of 116
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
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

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 316 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2022_22A.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2022_22A.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2022_22A.xlsx'));
  console.log('Exported 22A Da_check:', res1);
  console.log('Exported 22A PL_outputOCR:', res2);

  // Sync 2 duplicate documents to Tl_loại_VP_Toàn_PL.xlsx if not already present
  console.log('Checking trùng documents of 22A in Tl_loại_VP_Toàn_PL.xlsx...');
  const ExcelJS = (await import('exceljs')).default;
  const wbTl = new ExcelJS.Workbook();
  const tlPath = path.join(DA_CHECK_DIR, 'Tl_loại_VP_Toàn_PL.xlsx');
  await wbTl.xlsx.readFile(tlPath);
  const wsTr = wbTl.getWorksheet('Trùng');
  let has159 = false;
  let has160 = false;
  wsTr.eachRow((r, rowNumber) => {
    const val = (r.getCell(3).value || '').toString();
    if (val.includes('159/BC-UBND')) has159 = true;
    if (val.includes('160/BC-UBND')) has160 = true;
  });

  if (!has159) {
    await appendTaiLieuLoai({
      type: 'trung',
      tenVanBan: 'Báo cáo số 159/BC-UBND ngày 21/10/2022 đánh giá tình hình thực hiện quy định tiêu chuẩn xã, thị trấn phù hợp với trẻ em năm 2022',
      soHoSo: 'PL_2022_22A',
      thbq: 'Vĩnh viễn'
    });
    console.log('Appended 159/BC-UBND to Tl_loại_VP_Toàn_PL.xlsx');
  } else {
    console.log('159/BC-UBND already present in Tl_loại_VP_Toàn_PL.xlsx');
  }

  if (!has160) {
    await appendTaiLieuLoai({
      type: 'trung',
      tenVanBan: 'Báo cáo số 160/BC-UBND ngày 21/10/2022 kết quả rà soát hộ nghèo, hộ cận nghèo cuối năm 2022 trên địa bàn xã Phú Lộc',
      soHoSo: 'PL_2022_22A',
      thbq: 'Vĩnh viễn'
    });
    console.log('Appended 160/BC-UBND to Tl_loại_VP_Toàn_PL.xlsx');
  } else {
    console.log('160/BC-UBND already present in Tl_loại_VP_Toàn_PL.xlsx');
  }
}

// ==========================================
// 3. PROCESS PL_2022_22D
// ==========================================
async function process22D() {
  console.log('\n>>> PROCESSING PL_2022_22D...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2022_22D.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const starts = [
    null, // 001 cover
    1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22,
    25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    49, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 70, 71, 72, 73, 74,
    75, 76, 82, 83, 84, 85, 86, 87, 88, 90, 91, 92, 93, 94, 95, 96, 98, 99, 100, 102, 103,
    106, 109, 111, 113, 116, 117, 118, 119, 120, 121, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132,
    134, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 148, 149, 151, 152, 153, 154, 168, 169, 170,
    171, 172, 174, 176, 178, 179, 180,
    null // 133 (Page 2 of 132, sheets 180-181)
  ];
  const maxSheet = 181;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ công văn đi của UBND xã Phú Lộc năm 2022';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2022_22D';
  job.data.namGiaiDoan = '2022';
  job.data.thoiGianHoSo = 'Từ ngày 04/01/2022 đến ngày 26/12/2022';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else if (idx === 132) {
      // 133.jpg: continuation page of 132
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
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

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 181 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2022_22D.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2022_22D.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2022_22D.xlsx'));
  console.log('Exported 22D Da_check:', res1);
  console.log('Exported 22D PL_outputOCR:', res2);
}

// ==========================================
// 4. PROCESS PL_2022_22C
// ==========================================
async function process22C() {
  console.log('\n>>> PROCESSING PL_2022_22C...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2022_22C.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // Exact sheet starts for 254 images
  const starts = [
    null, // 001 cover
    1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 30, 32, 34, 35, 36, 37, 38,
    40, 42, 43, 44, 45, 46, 47, 50, 51, 53, 55, 58, 59, 61, 63, 64, 68, 70, 72, 74, 76, 78, 80, 82, 83, 84, 85, 86, 87, 88, 89, 90,
    91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 110, 112, 113, 114, 116, 118, 120, 121, 122, 123, 124, 125, 126, 127, 128,
    129, 130, 131, 132, 133, 134, 135, 136, 138, 140, 142, 144, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165,
    166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 193, 194, 195, 196, 197, 198,
    199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 217, 218, 219, 220, 221, 222, 224, 226, 227, 228, 229, 231, 233, 234, 235,
    236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 250, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 265, 266, 267, 268, 269, 270, 271,
    272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 297, 298, 299, 301, 303,
    null // 254 Annex table list of 253 (303-304)
  ];
  const maxSheet = 304;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ quyết định đi của UBND xã Phú Lộc năm 2022';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2022_22C';
  job.data.namGiaiDoan = '2022';
  job.data.thoiGianHoSo = 'Từ ngày 06/05/2022 đến ngày 01/12/2022';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else if (idx === 253) {
      // 254.jpg: Annex table list of 253
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
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

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 304 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2022_22C.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2022_22C.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2022_22C.xlsx'));
  console.log('Exported 22C Da_check:', res1);
  console.log('Exported 22C PL_outputOCR:', res2);
}

// ==========================================
// MAIN RUNNER
// ==========================================
async function main() {
  try {
    await process22B();
    await process22A();
    await process22D();
    await process22C();
    console.log('\n==========================================');
    console.log('ALL 4 DOSSIERS COMPLETED SUCCESSFULLY!');
    console.log('==========================================');
  } catch (err) {
    console.error('ERROR during batch execution:', err);
    process.exit(1);
  }
}

main();
