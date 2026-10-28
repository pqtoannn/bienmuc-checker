import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const P_RAW_EXCEL = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check';

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
      if (skipFiles && skipFiles.includes(im.fileName)) {
        im.status = 'skip';
        im.isExcluded = true;
        im.skipReason = 'Bìa hồ sơ hoặc tờ chốt đính kèm / trùng lặp';
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
  // 1. PL_2016_16I
  console.log('\n--- Building config for PL_2016_16I ---');
  const wbI = new ExcelJS.Workbook();
  await wbI.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2016_16I.xlsx'));
  const wsI = wbI.worksheets[0];
  const starts16I = [
    1, 2, 5, 11, 12, 15, 20, 22, 30, 31, 32, 36, 39, 40, 41, 47, 51, 52, 53, 54,
    55, 57, 58, 59, 61, 62, 64, 65, 74, 78, 96, 97, 98, 99, 100, 102, 103, 105,
    109, 110, 114, 115, 119, 124, 136, 162, 163, 164, 165
  ];
  const finalEndI = 166;
  const rows16I = [];
  for (let i = 0; i < starts16I.length; i++) {
    const photoNum = i + 2;
    const fStr = String(photoNum).padStart(3, '0') + '.jpg';
    const start = starts16I[i];
    const end = (i < starts16I.length - 1) ? starts16I[i + 1] - 1 : finalEndI;
    const toSo = (start === end) ? String(start).padStart(2, '0') : `${String(start).padStart(2, '0')}-${String(end).padStart(2, '0')}`;

    const rawRow = wsI.getRow(i + 8);
    let so = rawRow.getCell(2).text?.trim() || '';
    let d = rawRow.getCell(3).text?.trim() || '';
    let ty = rawRow.getCell(4).text?.trim() || '';
    let tg = rawRow.getCell(5).text?.trim() || 'Ủy ban nhân dân xã Phú Lộc';
    let loaiBan = rawRow.getCell(7).text?.trim() || 'Bản gốc';

    // Specific corrections from visual inspection:
    if (photoNum === 47) {
      so = '119/BC-UBND';
      d = '26/09/2016';
    } else if (photoNum === 48) {
      so = '120/BC-UBND';
      d = '26/09/2016';
    } else if (photoNum === 49) {
      so = '121/BC-UBND';
      d = '27/09/2016';
    } else if (photoNum === 50) {
      so = '122/BC-UBND';
      d = '27/09/2016';
    }

    rows16I.push({
      p: fStr,
      so: so,
      d: d,
      ty: ty,
      tg: tg,
      toSo: toSo,
      loaiBan: loaiBan
    });
  }

  await processDossier({
    dosId: 'PL_2016_16I',
    title: 'BÁO CÁO',
    year: '2016',
    skipFiles: ['001.jpg'],
    rowsConfig: rows16I
  });

  // 2. PL_2016_16J
  console.log('\n--- Building config for PL_2016_16J ---');
  const wbJ = new ExcelJS.Workbook();
  await wbJ.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2016_16J.xlsx'));
  const wsJ = wbJ.worksheets[0];
  const starts16J = [
    1, 2, 3, 8, 12, 13, 17, 18, 22, 27, 31, 35, 36, 37, 40, 44, 48, 52, 56, 60,
    66, 71, 72, 75, 79, 85, 88, 91, 94, 97, 100, 103, 107, 110, 113, 116, 119, 122,
    125, 129, 132, 136, 139, 141, 145, 151, 155, 161, 167, 170, 173, 177, 180, 183,
    186, 189, 198, 201, 204, 207, 210, 213, 216, 221, 224
  ];
  const finalEndJ = 224;
  const rows16J = [];
  for (let i = 0; i < starts16J.length; i++) {
    const photoNum = i + 1; // 001.jpg is doc 1
    const fStr = String(photoNum).padStart(3, '0') + '.jpg';
    const start = starts16J[i];
    const end = (i < starts16J.length - 1) ? starts16J[i + 1] - 1 : finalEndJ;
    const toSo = (start === end) ? String(start).padStart(2, '0') : `${String(start).padStart(2, '0')}-${String(end).padStart(2, '0')}`;

    const rawRow = wsJ.getRow(i + 6); // row 6 is doc 1 in 16J
    let so = rawRow.getCell(2).text?.trim() || '';
    let d = rawRow.getCell(3).text?.trim() || '';
    let ty = rawRow.getCell(4).text?.trim() || '';
    let tg = rawRow.getCell(5).text?.trim() || 'Ủy ban nhân dân xã Phú Lộc';
    let loaiBan = rawRow.getCell(7).text?.trim() || 'Bản gốc';

    rows16J.push({
      p: fStr,
      so: so,
      d: d,
      ty: ty,
      tg: tg,
      toSo: toSo,
      loaiBan: loaiBan
    });
  }

  await processDossier({
    dosId: 'PL_2016_16J',
    title: 'ĐÁNH GIÁ CÁN BỘ CÔNG CHỨC NĂM 2016',
    year: '2016',
    skipFiles: [],
    rowsConfig: rows16J
  });

  // 3. PL_2016_16F
  console.log('\n--- Building config for PL_2016_16F ---');
  const wbF = new ExcelJS.Workbook();
  await wbF.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2016_16F.xlsx'));
  const wsF = wbF.worksheets[0];
  const starts16F = [
    1, 2, 5, 6, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 25, 28,
    30, 31, 32, 34, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51,
    52, 53, 54, 55, 60, 61, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 76,
    77, 78, 79, 80, 81, 88, 89
  ];
  const finalEndF = 89;
  const rows16F = [];
  for (let i = 0; i < starts16F.length; i++) {
    const photoNum = i + 2; // 002.jpg is doc 1
    const fStr = String(photoNum).padStart(3, '0') + '.jpg';
    const start = starts16F[i];
    const end = (i < starts16F.length - 1) ? starts16F[i + 1] - 1 : finalEndF;
    const toSo = (start === end) ? String(start).padStart(2, '0') : `${String(start).padStart(2, '0')}-${String(end).padStart(2, '0')}`;

    const rawRow = wsF.getRow(i + 8);
    let so = rawRow.getCell(2).text?.trim() || '';
    let d = rawRow.getCell(3).text?.trim() || '';
    let ty = rawRow.getCell(4).text?.trim() || '';
    let tg = rawRow.getCell(5).text?.trim() || 'Ủy ban nhân dân xã Phú Lộc';
    let loaiBan = rawRow.getCell(7).text?.trim() || 'Bản gốc';

    rows16F.push({
      p: fStr,
      so: so,
      d: d,
      ty: ty,
      tg: tg,
      toSo: toSo,
      loaiBan: loaiBan
    });
  }

  await processDossier({
    dosId: 'PL_2016_16F',
    title: 'THÔNG BÁO',
    year: '2016',
    skipFiles: ['001.jpg'],
    rowsConfig: rows16F
  });

  console.log('\n========================================\nALL BATCH 2016-2 DOSSIERS PROCESSED SUCCESSFULLY!');
}

run().catch(console.error);
