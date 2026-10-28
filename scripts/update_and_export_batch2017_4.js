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
  // 1. Dossier PL_2017_17P
  const wbP = new ExcelJS.Workbook();
  await wbP.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2017_17P.xlsx'));
  const wsP = wbP.worksheets[0];
  const startsP = [
    1, 2, 6, 10, 17, 26, 28, 30, 33, 34, 37, 40, 41, 42, 48, 49, 51, 52, 53, 54,
    59, 61, 65, 66, 67, 68, 70, 73, 74, 75, 78, 81, 82, 84, 85, 86, 87, 88, 89, 90,
    94, 101, 102, 105, 106, 107, 111, 113, 120, 122, 123, 126, 127, 128, 130, 132, 134, 137, 142, 143,
    145, 146, 150, 151, 152, 153, 155, 156, 160, 161, 163, 174, 180, 181, 184, 188
  ];
  const rowsP = [];
  for (let i = 0; i < startsP.length; i++) {
    const s = startsP[i];
    const e = (i === startsP.length - 1) ? 190 : startsP[i + 1] - 1;
    const toSo = (s === e) ? String(s).padStart(2, '0') : (String(s).padStart(2, '0') + '-' + String(e).padStart(2, '0'));
    const photoIdx = i + 2;
    const p = String(photoIdx).padStart(3, '0') + '.jpg';
    const excelRowIdx = i + 7;
    const r = wsP.getRow(excelRowIdx);
    let so = String(r.getCell(2).value || '').trim();
    let d = String(r.getCell(3).value || '').trim();
    let ty = String(r.getCell(4).value || '').trim();
    let tg = String(r.getCell(5).value || '').trim();
    let loaiBan = String(r.getCell(7).value || 'Bản gốc').trim();
    const files = (photoIdx === 77) ? ['077.jpg', '078.jpg'] : [p];

    if (p === '068.jpg' && (so === '609/BC-UBND' || so.includes('609'))) {
      so = '65/BC-UBND';
    }

    rowsP.push({ p, so, d, ty, tg, toSo, loaiBan, files });
  }

  await processDossier({
    dosId: 'PL_2017_17P',
    title: 'Hồ sơ Báo cáo (Tập 01 - Quý 1 và Quý 2) năm 2017 xã Phú Lộc',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsP
  });

  // 2. Dossier PL_2017_17R
  const wbR = new ExcelJS.Workbook();
  await wbR.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2017_17R.xlsx'));
  const wsR = wbR.worksheets[0];
  const startsR = [
    1, 2, 3, 5, 7, 10, 13, 14, 15, 17, 19, 21, 25, 27, 28, 31, 32, 34, 36, 38, 39, 42,
    43, 44, 45, 48, 50, 52, 54, 56, 59, 61, 63, 65, 67, 69, 74, 75, 79, 81, 84, 88, 93, 97,
    99, 101, 103, 106, 107, 109, 112, 113, 116, 118, 119, 121, 122, 124, 126, 127, 129, 132, 138, 139, 141, 143,
    147, 153, 155, 158, 159, 162, 164, 166, 169, 173, 178, 180, 182, 183, 185, 187, 191, 194, 197, 201
  ];
  const rowsR = [];
  for (let i = 0; i < startsR.length; i++) {
    const s = startsR[i];
    const e = (i === startsR.length - 1) ? 202 : startsR[i + 1] - 1;
    const toSo = (s === e) ? String(s).padStart(2, '0') : (String(s).padStart(2, '0') + '-' + String(e).padStart(2, '0'));
    const photoIdx = i + 2;
    const p = String(photoIdx).padStart(3, '0') + '.jpg';
    const excelRowIdx = i + 7;
    const r = wsR.getRow(excelRowIdx);
    let so = String(r.getCell(2).value || '').trim();
    let d = String(r.getCell(3).value || '').trim();
    let ty = String(r.getCell(4).value || '').trim();
    let tg = String(r.getCell(5).value || '').trim();
    let loaiBan = String(r.getCell(7).value || 'Bản gốc').trim();
    const files = (photoIdx === 87) ? ['087.jpg', '088.jpg'] : [p];

    if (photoIdx === 87 && so === '09/KH-UBND') {
      so = '08/KH-UBND';
    }

    rowsR.push({ p, so, d, ty, tg, toSo, loaiBan, files });
  }

  await processDossier({
    dosId: 'PL_2017_17R',
    title: 'Hồ sơ Kế hoạch năm 2017 xã Phú Lộc',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsR
  });

  console.log('\n=== Batch 2017-4 Completed Successfully! ===');
}

run().catch(err => {
  console.error('Batch 2017-4 error:', err);
  process.exit(1);
});
