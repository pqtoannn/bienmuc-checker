import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const P_RAW_EXCEL = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check';

function formatRange(start, end) {
  const sStr = String(start).padStart(2, '0');
  if (start === end) return sStr;
  const eStr = String(end).padStart(2, '0');
  return `${sStr}-${eStr}`;
}

async function processDossier(config) {
  const { dosId, title, year, skipFiles, rowsConfig } = config;
  console.log(`\n========================================\nProcessing ${dosId}...`);

  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  let job;
  if (fs.existsSync(jobPath)) {
    job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
  } else {
    job = { data: {}, images: [] };
  }

  job.data = job.data || {};
  job.data.tenHoSo = title;
  job.data.tieuDeNghiQuyet = title;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = year;
  job.data.tongSoToText = '';

  if (job.images) {
    job.images.forEach(im => {
      const fileName = typeof im === 'string' ? im : im.fileName;
      if (skipFiles && skipFiles.includes(fileName)) {
        if (typeof im === 'object') {
          im.status = 'skip';
          im.isExcluded = true;
          im.skipReason = 'Bìa hồ sơ hoặc tờ chốt đính kèm / trùng lặp';
        }
      }
    });
  }

  const activeRows = [];
  for (let i = 0; i < rowsConfig.length; i++) {
    const rc = rowsConfig[i];
    let so = rc.so || '';
    let d = rc.d || '';
    let tg = rc.tg || 'Ủy ban nhân dân xã Phú Lộc';
    let ty = rc.ty || '';
    let loaiBan = rc.loaiBan || 'Bản gốc';

    if (tg.toLowerCase().includes('uỷ')) {
      tg = tg.replace(/uỷ/g, 'ủy').replace(/Uỷ/g, 'Ủy');
    }

    activeRows.push({
      soTT: String(i + 1),
      soKyHieuVanBan: so,
      ngayThangVanBan: d,
      tenLoaiTrichYeu: ty,
      tacGiaVanBan: tg,
      toSoTrangSo: rc.toSo,
      loaiBan: loaiBan,
      ghiChu: '',
      banGocChinh: loaiBan.includes('gốc') || loaiBan.includes('chính') ? loaiBan : '',
      banSao: loaiBan.includes('sao') || loaiBan.includes('Photo') ? loaiBan : '',
      doMat: '',
      sourceFileNames: rc.files || [rc.p]
    });
  }

  job.data.rows = activeRows;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  // Export to PL_outputOCR
  const outExcelOcr = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  await exportJsonToExcel(job, outExcelOcr);
  console.log(`Exported to ${outExcelOcr}`);

  // Export to Da_check
  const outExcelDaCheck = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  await exportJsonToExcel(job, outExcelDaCheck);
  console.log(`Exported to ${outExcelDaCheck}`);

  console.log(`Done ${dosId}: ${activeRows.length} active rows.`);
}

async function run() {
  // ----------------------------------------------------
  // 1. PL_2016_16H
  // ----------------------------------------------------
  console.log('Building rows for PL_2016_16H...');
  const rawWbH = new ExcelJS.Workbook();
  await rawWbH.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2016_16H.xlsx'));
  const wsH = rawWbH.worksheets[0];

  // 017.jpg is duplicate of 016.jpg
  await appendTaiLieuLoai({
    type: 'trung',
    soHoSo: 'PL_2016_16H',
    tenVanBan: 'Công văn về việc báo cáo tình hình xử lý vi phạm trong lĩnh vực khai thác tài nguyên khoáng sản',
    lyDoTrung: 'Trùng hs PL_2016_16H (ảnh 017.jpg trùng ảnh 016.jpg)'
  });

  const startsH = [
    1, 4, 5, 8, 11, 12, 13, 14, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 
    29, 31, 32, 33, 36, 38, 39, 40, 41, 42, 43, 44, 45, 47, 48, 49, 51, 52, 54, 55, 
    56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 74, 75, 76, 
    77, 84, 85, 86, 87, 91, 92, 93, 94, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 109, 
    110, 111, 112, 113, 114, 115, 118, 119, 121, 122, 123, 124, 125, 126, 127, 129, 130, 131, 132, 133, 
    134, 135, 146, 147, 148, 149, 150, 151, 152
  ];
  const finalSheetH = 152;

  const rowsConfigH = [];
  let currentRawRowH = 8;
  for (let i = 0; i < startsH.length; i++) {
    const s = startsH[i];
    const e = (i === startsH.length - 1) ? finalSheetH : startsH[i + 1] - 1;
    const toSo = formatRange(s, e);

    let imgIdx = i + 2;
    if (i >= 15) {
      imgIdx = i + 3; // Shift by 1 because 017.jpg is skipped duplicate!
    }
    const imgName = String(imgIdx).padStart(3, '0') + '.jpg';

    if (currentRawRowH === 23) {
      currentRawRowH++; // Skip raw row 23 (017.jpg)
    }

    const rawRow = wsH.getRow(currentRawRowH);
    currentRawRowH++;

    let so = rawRow.getCell(2).text?.trim() || '';
    let d = rawRow.getCell(3).text?.trim() || '';
    let ty = rawRow.getCell(4).text?.trim() || '';
    let tg = rawRow.getCell(5).text?.trim() || 'Ủy ban nhân dân xã Phú Lộc';
    let loaiBan = rawRow.getCell(7).text?.trim() || 'Bản gốc';

    rowsConfigH.push({
      p: imgName,
      files: [imgName],
      so: so,
      d: d,
      ty: ty,
      tg: tg,
      toSo: toSo,
      loaiBan: loaiBan
    });
  }

  await processDossier({
    dosId: 'PL_2016_16H',
    title: 'CÔNG VĂN',
    year: '2016',
    skipFiles: ['001.jpg', '017.jpg'],
    rowsConfig: rowsConfigH
  });

  // ----------------------------------------------------
  // 2. PL_2016_16D
  // ----------------------------------------------------
  console.log('\nBuilding rows for PL_2016_16D...');
  const rawWbD = new ExcelJS.Workbook();
  await rawWbD.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2016_16D.xlsx'));
  const wsD = rawWbD.worksheets[0];

  // Sync duplicates for 16D
  await appendTaiLieuLoai({
    type: 'trung',
    soHoSo: 'PL_2016_16D',
    tenVanBan: 'Tờ trình về việc công nhận xã đạt chuẩn "An toàn về An ninh, trật tự" năm 2015',
    lyDoTrung: 'Trùng hs PL_2016_16D (ảnh 088.jpg trùng ảnh 087.jpg)'
  });
  await appendTaiLieuLoai({
    type: 'trung',
    soHoSo: 'PL_2016_16D',
    tenVanBan: 'Tờ trình về việc điều chỉnh danh mục đầu tư đường giao thông nông thôn giai đoạn 2013-2020 trong đề án xây dựng nông thôn mới xã Phú Lộc',
    lyDoTrung: 'Trùng hs PL_2016_16D (ảnh 120.jpg trùng ảnh 119.jpg)'
  });
  await appendTaiLieuLoai({
    type: 'trung',
    soHoSo: 'PL_2016_16D',
    tenVanBan: 'Tờ trình về việc đề nghị khen thưởng các tập thể, cá nhân có thành tích xuất sắc trong công tác Quân sự - Quốc phòng địa phương năm 2016',
    lyDoTrung: 'Trùng hs PL_2016_16D (ảnh 134.jpg trùng ảnh 133.jpg)'
  });

  const startsD = [
    // 002 to 021 (20 docs)
    1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 16, 18, 25, 26, 27, 28, 33, 34,
    // 022 to 041 (20 docs)
    37, 40, 41, 45, 50, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70,
    // 042 to 055 (14 docs)
    72, 73, 74, 75, 76, 80, 83, 84, 85, 86, 87, 89, 90, 91,
    // 056 to 065 (10 docs)
    92, 93, 94, 96, 98, 99, 101, 102, 103, 105,
    // 066 to 082 (17 docs)
    106, 107, 108, 109, 110, 111, 114, 118, 121, 122, 123, 125, 126, 128, 129, 130, 131,
    // 083(+084) to 099 (15 docs)
    132, 135, 136, 137, 138, 139, 140, 141, 143, 144, 146, 147, 149, 151, 152,
    // 100(+101) to 119 (19 docs)
    154, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 169, 173, 175, 179, 181, 182, 186,
    // 121 to 133 (13 docs)
    187, 189, 190, 191, 192, 193, 194, 195, 197, 204, 207, 209, 213
  ];
  const finalSheetD = 213;

  const rawRowsD = [];
  for (let r = 8; r <= 140; r++) {
    const row = wsD.getRow(r);
    const img = String(r - 6).padStart(3, '0') + '.jpg';
    rawRowsD.push({
      r,
      img,
      so: row.getCell(2).text?.trim() || '',
      d: row.getCell(3).text?.trim() || '',
      trich: row.getCell(4).text?.trim() || '',
      tg: row.getCell(5).text?.trim() || 'Ủy ban nhân dân xã Phú Lộc',
      loaiBan: row.getCell(7).text?.trim() || 'Bản gốc'
    });
  }

  const activeDocsD = [];
  for (const item of rawRowsD) {
    if (['088.jpg', '120.jpg', '134.jpg'].includes(item.img)) continue;
    if (item.img === '084.jpg') {
      activeDocsD[activeDocsD.length - 1].files.push('084.jpg');
      continue;
    }
    if (item.img === '101.jpg') {
      activeDocsD[activeDocsD.length - 1].files.push('101.jpg');
      continue;
    }
    activeDocsD.push({
      ...item,
      files: [item.img]
    });
  }

  const rowsConfigD = [];
  for (let i = 0; i < activeDocsD.length; i++) {
    const doc = activeDocsD[i];
    const s = startsD[i];
    const e = (i === activeDocsD.length - 1) ? finalSheetD : startsD[i + 1] - 1;
    const toSo = formatRange(s, e);

    rowsConfigD.push({
      p: doc.img,
      files: doc.files,
      so: doc.so,
      d: doc.d,
      ty: doc.trich,
      tg: doc.tg,
      toSo: toSo,
      loaiBan: doc.loaiBan
    });
  }

  await processDossier({
    dosId: 'PL_2016_16D',
    title: 'TỜ TRÌNH',
    year: '2016',
    skipFiles: ['001.jpg', '088.jpg', '120.jpg', '134.jpg'],
    rowsConfig: rowsConfigD
  });

  console.log('\nALL DOSSIERS IN BATCH 2016-4 PROCESSED SUCCESSFULLY!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
