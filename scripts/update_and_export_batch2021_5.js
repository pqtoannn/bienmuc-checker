import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

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
// 1. PROCESS PL_2021_21k
// ==========================================
async function process21k() {
  console.log('\n>>> PROCESSING PL_2021_21k...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21k.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 229 photos: idx 0 is cover (001.jpg)
  // 228 active documents: idx 1 to 228
  // Multi-page documents:
  // idx 55 (056.jpg): 55-56
  // idx 72 (073.jpg): 73-74
  // idx 80 (081.jpg): 82-83
  // idx 82 (083.jpg): 85-86
  // idx 145 (146.jpg): 149-150
  // idx 148 (149.jpg): 153-154
  // idx 175 (176.jpg): 181-182
  // idx 198 (199.jpg): 205-206

  const starts = [null]; // idx 0 is cover
  let curSheet = 1;

  for (let idx = 1; idx <= 228; idx++) {
    starts.push(curSheet);
    let pageCount = 1;
    if (idx === 55) pageCount = 2; // 056.jpg
    else if (idx === 72) pageCount = 2; // 073.jpg
    else if (idx === 80) pageCount = 2; // 081.jpg
    else if (idx === 82) pageCount = 2; // 083.jpg
    else if (idx === 145) pageCount = 2; // 146.jpg
    else if (idx === 148) pageCount = 2; // 149.jpg
    else if (idx === 175) pageCount = 2; // 176.jpg
    else if (idx === 198) pageCount = 2; // 199.jpg

    curSheet += pageCount;
  }

  const maxSheet = 236;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ quyết định đi (từ ngày 16/12 đến ngày 31/12) của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21k';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 16/12/2021 đến ngày 31/12/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.data.rowsTrung = [];

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
      row.loaiBan = 'Bản gốc';
      row.tacGiaVanBan = 'Ủy ban nhân dân xã Phú Lộc';

      // Clean up common OCR typos in số hiệu
      if (row.soKyHieuVanBan) {
        row.soKyHieuVanBan = row.soKyHieuVanBan.replace(/O/g, '0').trim();
      }
    }
  });

  // Fix last 2 rows if needed
  if (job.data.rows[227]) {
    job.data.rows[227].soKyHieuVanBan = '1636/QĐ-UBND';
    job.data.rows[227].ngayThangVanBan = '31/12/2021';
  }
  if (job.data.rows[228]) {
    job.data.rows[228].soKyHieuVanBan = '1637/QĐ-UBND';
    job.data.rows[228].ngayThangVanBan = '31/12/2021';
  }

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.fileName === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 236 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21k.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21k.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21k.xlsx'));
  console.log('Exported 21k Da_check:', res1);
  console.log('Exported 21k PL_outputOCR:', res2);
}

// ==========================================
// 2. PROCESS PL_2021_21l
// ==========================================
async function process21l() {
  console.log('\n>>> PROCESSING PL_2021_21l...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21l.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 319 photos:
  // idx 0 is cover (001.jpg)
  // idx 1 to 315 are active documents (002.jpg to 316.jpg)
  // idx 316 (317.jpg), 317 (318.jpg), 318 (319.jpg) are duplicate documents (Trùng)
  // Total active: 315 documents, 344 sheets (continuous 01 to 344)

  const starts = [null]; // idx 0 is cover
  let curSheet = 1;

  for (let idx = 1; idx <= 315; idx++) {
    starts.push(curSheet);
    let pageCount = 1;
    if (idx === 6) pageCount = 2; // 007.jpg: 06-07
    else if (idx === 81) pageCount = 10; // 082.jpg: 82-91
    else if (idx === 82) pageCount = 2; // 083.jpg: 92-93
    else if (idx === 106) pageCount = 2; // 107.jpg: 117-118
    else if (idx === 120) pageCount = 4; // 121.jpg: 132-135
    else if (idx === 124) pageCount = 2; // 125.jpg: 139-140
    else if (idx === 140) pageCount = 2; // 141.jpg: 156-157
    else if (idx === 155) pageCount = 2; // 156.jpg: 172-173
    else if (idx === 204) pageCount = 2; // 205.jpg: 222-223
    else if (idx === 226) pageCount = 2; // 227.jpg: 245-246
    else if (idx === 231) pageCount = 2; // 232.jpg: 251-252
    else if (idx === 232) pageCount = 2; // 233.jpg: 253-254
    else if (idx === 236) pageCount = 2; // 237.jpg: 258-259
    else if (idx === 241) pageCount = 2; // 242.jpg: 264-265
    else if (idx === 242) pageCount = 2; // 243.jpg: 266-267
    else if (idx === 264) pageCount = 2; // 265.jpg: 289-290
    else if (idx === 265) pageCount = 2; // 266.jpg: 291-292
    else if (idx === 293) pageCount = 2; // 294.jpg: 320-321
    else if (idx === 297) pageCount = 2; // 298.jpg: 325-326

    curSheet += pageCount;
  }

  // The 3 duplicate photos
  starts.push(null); // idx 316: 317.jpg
  starts.push(null); // idx 317: 318.jpg
  starts.push(null); // idx 318: 319.jpg

  const maxSheet = 344;
  const sheetRanges = computeSheetRanges(starts, maxSheet);

  job.data.tenHoSo = 'Hồ sơ quyết định đi (tháng 11 quý IV) của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21l';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 01/11/2021 đến ngày 30/11/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.data.rowsTrung = [];

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else if (idx >= 316) {
      // 317.jpg, 318.jpg, 319.jpg are Trùng
      img.isExcluded = true;
      img.status = 'skip';
      row.ghiChu = 'Trùng';
      row.toSoTrangSo = '';
      job.data.rowsTrung.push({ ...row });
    } else {
      img.isExcluded = false;
      img.status = 'active';
      row.toSoTrangSo = sheetRanges[idx];
      row.loaiBan = 'Bản gốc';
      row.tacGiaVanBan = 'Ủy ban nhân dân xã Phú Lộc';

      // Clean up common OCR typos in số hiệu
      if (row.soKyHieuVanBan) {
        row.soKyHieuVanBan = row.soKyHieuVanBan.replace(/O/g, '0').trim();
      }
    }
  });

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.fileName === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 344 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21l.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21l.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21l.xlsx'));
  console.log('Exported 21l Da_check:', res1);
  console.log('Exported 21l PL_outputOCR:', res2);

  // Sync 3 duplicate documents to Tl_loại_VP_Toàn_PL.xlsx sheet Trùng
  console.log('Syncing 3 duplicate documents of 21l to Tl_loại_VP_Toàn_PL.xlsx...');
  const ExcelJS = (await import('exceljs')).default;
  const wbTl = new ExcelJS.Workbook();
  const tlPath = path.join(DA_CHECK_DIR, 'Tl_loại_VP_Toàn_PL.xlsx');
  await wbTl.xlsx.readFile(tlPath);
  const wsTrung = wbTl.getWorksheet('Trùng');

  const existingTitles = [];
  wsTrung.eachRow(r => {
    const val = (r.getCell(3).value || '').toString();
    if (val) existingTitles.push(val);
  });

  const duplicateDocs = [
    {
      soKyHieu: '1188/QĐ-UBND',
      ngay: '18/11/2021',
      title: 'Quyết định số 1188/QĐ-UBND ngày 18/11/2021 về việc cách ly y tế tại nhà, nơi lưu trú Phòng, chống Dịch COVID-19'
    },
    {
      soKyHieu: '1002/QĐ-UBND',
      ngay: '25/11/2021',
      title: 'Quyết định số 1002/QĐ-UBND ngày 25/11/2021 về việc cách ly y tế tại nhà, nơi lưu trú Phòng, chống Dịch COVID-19'
    },
    {
      soKyHieu: '953/QĐ-UBND',
      ngay: '11/11/2021',
      title: 'Quyết định số 953/QĐ-UBND ngày 11/11/2021 về việc cách ly y tế tại nhà, nơi lưu trú Phòng, chống Dịch COVID-19'
    }
  ];

  for (const d of duplicateDocs) {
    const isPresent = existingTitles.some(t => t.includes(d.soKyHieu));
    if (!isPresent) {
      await appendTaiLieuLoai({
        type: 'trung',
        tenVanBan: d.title,
        soHoSo: 'PL_2021_21l',
        thbq: 'Vĩnh viễn'
      });
      console.log(`Appended duplicate ${d.soKyHieu} to Tl_loại_VP_Toàn_PL.xlsx`);
    } else {
      console.log(`Duplicate ${d.soKyHieu} already present in Tl_loại_VP_Toàn_PL.xlsx`);
    }
  }
}

async function run() {
  await process21k();
  await process21l();
  console.log('\n=== ALL BATCH 5 (2021) DOSSIERS SUCCESSFULLY PROCESSED ===');
}

run().catch(err => {
  console.error('Error running batch 5 2021:', err);
  process.exit(1);
});
