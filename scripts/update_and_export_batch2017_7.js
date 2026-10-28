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
        im.skipReason = 'Bìa hồ sơ hoặc tờ chốt đính kèm';
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
  // 1. Dossier PL_2017_17I
  const wbI = new ExcelJS.Workbook();
  await wbI.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2017_17I.xlsx'));
  const wsI = wbI.worksheets[0];
  const startsI = [
    // 002-026: (25)
    1, 2, 9, 16, 18, 20, 22, 24, 26, 30, 35, 37, 39, 40, 41, 43, 47, 48, 49, 50, 51, 52, 53, 56, 57,
    // 027-051: (25)
    60, 63, 64, 65, 67, 68, 69, 70, 71, 72, 73, 76, 80, 81, 82, 83, 84, 86, 88, 90, 92, 94, 95, 96, 97,
    // 052-076: (25)
    101, 102, 104, 105, 106, 108, 109, 111, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 128, 130, 132, 134,
    // 077-101: (25)
    136, 138, 140, 142, 144, 146, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166,
    // 102-126: (25)
    168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193
  ];

  const rowsI = [];
  for (let i = 0; i < startsI.length; i++) {
    const s = startsI[i];
    const e = (i === startsI.length - 1) ? 193 : startsI[i + 1] - 1;
    const toSo = (s === e) ? String(s).padStart(2, '0') : (String(s).padStart(2, '0') + '-' + String(e).padStart(2, '0'));
    const photoIdx = i + 2;
    const p = String(photoIdx).padStart(3, '0') + '.jpg';
    const excelRowIdx = i + 7;
    const r = wsI.getRow(excelRowIdx);
    let so = String(r.getCell(2).value || '').trim();
    let d = String(r.getCell(3).value || '').trim();
    let ty = String(r.getCell(4).value || '').trim();
    let tg = String(r.getCell(5).value || '').trim();
    let loaiBan = String(r.getCell(7).value || 'Bản gốc').trim();
    const files = [p];

    rowsI.push({ p, so, d, ty, tg, toSo, loaiBan, files });
  }

  await processDossier({
    dosId: 'PL_2017_17I',
    title: 'Hồ sơ Quyết định (Tập 02 - Quý 4) năm 2017 xã Phú Lộc',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsI
  });

  // 2. Dossier PL_2017_17F
  const wbF = new ExcelJS.Workbook();
  await wbF.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2017_17F.xlsx'));
  const wsF = wbF.worksheets[0];
  const startsF = [
    // 002-024: (23)
    1, 2, 3, 5, 11, 12, 14, 16, 18, 19, 21, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36,
    // 025-047: (23)
    37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 50, 53, 54, 55, 57, 59, 61, 63, 64, 66, 68, 69,
    // 048-070: (23)
    70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 81, 83, 84, 85, 86, 88, 89, 91, 94, 95, 97, 104, 105,
    // 071-093: (23)
    106, 107, 108, 110, 111, 113, 114, 115, 118, 119, 120, 123, 125, 126, 127, 129, 131, 133, 135, 137, 139, 141, 142,
    // 094-116: (23)
    143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 161, 162, 163, 164, 165, 166,
    // 117-139: (23)
    167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 185, 188, 190, 192, 194, 195
  ];

  const rowsF = [];
  for (let i = 0; i < startsF.length; i++) {
    const s = startsF[i];
    const e = (i === startsF.length - 1) ? 195 : startsF[i + 1] - 1;
    const toSo = (s === e) ? String(s).padStart(2, '0') : (String(s).padStart(2, '0') + '-' + String(e).padStart(2, '0'));
    const photoIdx = i + 2;
    const p = String(photoIdx).padStart(3, '0') + '.jpg';
    const excelRowIdx = i + 7;
    const r = wsF.getRow(excelRowIdx);
    let so = String(r.getCell(2).value || '').trim();
    let d = String(r.getCell(3).value || '').trim();
    let ty = String(r.getCell(4).value || '').trim();
    let tg = String(r.getCell(5).value || '').trim();
    let loaiBan = String(r.getCell(7).value || 'Bản gốc').trim();
    const files = [p];

    rowsF.push({ p, so, d, ty, tg, toSo, loaiBan, files });
  }

  await processDossier({
    dosId: 'PL_2017_17F',
    title: 'Hồ sơ Quyết định (Tập 01 - Quý 1, 2, 3) năm 2017 xã Phú Lộc',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsF
  });

  console.log('\n=== Batch 2017-7 Completed Successfully! ===');
}

run().catch(err => {
  console.error('Batch 2017-7 error:', err);
  process.exit(1);
});
