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
  // 1. Dossier PL_2017_17E
  const wbE = new ExcelJS.Workbook();
  await wbE.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2017_17E.xlsx'));
  const wsE = wbE.worksheets[0];
  const startsE = [
    // 002-023: (22)
    1, 2, 3, 6, 8, 10, 11, 12, 13, 14, 15, 17, 20, 22, 23, 24, 25, 27, 31, 34, 35, 36,
    // 024-045: (22)
    39, 43, 46, 47, 48, 50, 51, 54, 57, 59, 60, 62, 63, 64, 67, 68, 69, 70, 71, 72, 73, 74,
    // 046-067: (22)
    75, 76, 77, 79, 80, 84, 86, 88, 90, 91, 92, 93, 94, 96, 97, 98, 101, 104, 106, 107, 108, 109,
    // 068-088: (21)
    110, 111, 112, 113, 114, 115, 119, 120, 121, 122, 126, 128, 129, 130, 132, 133, 134, 136, 138, 139, 140,
    // 089-108: (20)
    141, 144, 149, 153, 155, 156, 157, 159, 160, 162, 164, 165, 166, 167, 168, 169, 170, 171, 174, 177
  ];

  const rowsE = [];
  for (let i = 0; i < startsE.length; i++) {
    const s = startsE[i];
    const e = (i === startsE.length - 1) ? 177 : startsE[i + 1] - 1;
    const toSo = (s === e) ? String(s).padStart(2, '0') : (String(s).padStart(2, '0') + '-' + String(e).padStart(2, '0'));
    const photoIdx = i + 2;
    const p = String(photoIdx).padStart(3, '0') + '.jpg';
    const excelRowIdx = i + 7;
    const r = wsE.getRow(excelRowIdx);
    let so = String(r.getCell(2).value || '').trim();
    let d = String(r.getCell(3).value || '').trim();
    let ty = String(r.getCell(4).value || '').trim();
    let tg = String(r.getCell(5).value || '').trim();
    let loaiBan = String(r.getCell(7).value || 'Bản gốc').trim();
    const files = [p];

    rowsE.push({ p, so, d, ty, tg, toSo, loaiBan, files });
  }

  await processDossier({
    dosId: 'PL_2017_17E',
    title: 'Hồ sơ Tờ trình năm 2017 xã Phú Lộc',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsE
  });

  // 2. Dossier PL_2017_17O
  const wbO = new ExcelJS.Workbook();
  await wbO.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2017_17O.xlsx'));
  const wsO = wbO.worksheets[0];
  const startsO = [
    // 002-025: (24)
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25,
    // 026-049: (24)
    26, 29, 30, 32, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 52, 53, 54, 55,
    // 050-073: (24)
    56, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 73, 74, 75, 76, 77, 78, 79, 80, 81,
    // 074-096: (23)
    83, 84, 85, 86, 87, 91, 92, 94, 95, 96, 97, 98, 99, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
    // 097-119: (23)
    111, 112, 113, 115, 116, 118, 119, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 134, 136, 137, 138, 139
  ];

  const rowsO = [];
  for (let i = 0; i < startsO.length; i++) {
    const s = startsO[i];
    const e = (i === startsO.length - 1) ? 139 : startsO[i + 1] - 1;
    const toSo = (s === e) ? String(s).padStart(2, '0') : (String(s).padStart(2, '0') + '-' + String(e).padStart(2, '0'));
    const photoIdx = i + 2;
    const p = String(photoIdx).padStart(3, '0') + '.jpg';
    const excelRowIdx = i + 7;
    const r = wsO.getRow(excelRowIdx);
    let so = String(r.getCell(2).value || '').trim();
    let d = String(r.getCell(3).value || '').trim();
    let ty = String(r.getCell(4).value || '').trim();
    let tg = String(r.getCell(5).value || '').trim();
    let loaiBan = String(r.getCell(7).value || 'Bản gốc').trim();
    const files = [p];

    rowsO.push({ p, so, d, ty, tg, toSo, loaiBan, files });
  }

  await processDossier({
    dosId: 'PL_2017_17O',
    title: 'Hồ sơ Công văn đi năm 2017 xã Phú Lộc',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsO
  });

  console.log('\n=== Batch 2017-6 Completed Successfully! ===');
}

run().catch(err => {
  console.error('Batch 2017-6 error:', err);
  process.exit(1);
});
