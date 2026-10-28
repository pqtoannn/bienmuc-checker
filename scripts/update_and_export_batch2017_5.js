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
  // 1. Dossier PL_2017_17N
  const wbN = new ExcelJS.Workbook();
  await wbN.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2017_17N.xlsx'));
  const wsN = wbN.worksheets[0];
  const startsN = [
    // 002-024: (23 items)
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25,
    // 025-047: (23 items)
    26, 27, 28, 29, 30, 31, 32, 33, 34, 36, 38, 40, 41, 42, 44, 46, 48, 49, 50, 51, 52, 53, 54,
    // 048-069: (22 items)
    55, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 70, 72, 76, 77, 80, 81, 84, 86,
    // 070-091: (21 items, 071 merged into 070)
    87, 89, 91, 92, 93, 95, 96, 98, 99, 100, 101, 102, 104, 105, 106, 107, 108, 110, 111, 116, 117
  ];

  const rawRowsN = [];
  for (let i = 7; i <= wsN.rowCount; i++) {
    const r = wsN.getRow(i);
    const photoIdx = i - 5;
    const p = String(photoIdx).padStart(3, '0') + '.jpg';
    rawRowsN.push({
      photoIdx,
      p,
      so: String(r.getCell(2).value || '').trim(),
      d: String(r.getCell(3).value || '').trim(),
      ty: String(r.getCell(4).value || '').trim(),
      tg: String(r.getCell(5).value || '').trim(),
      loaiBan: String(r.getCell(7).value || 'Bản gốc').trim()
    });
  }

  const rowsN = [];
  let startIdx = 0;
  for (let i = 0; i < rawRowsN.length; i++) {
    const row = rawRowsN[i];
    if (row.p === '071.jpg') continue; // concluding sheet of 070.jpg

    const s = startsN[startIdx];
    const e = (startIdx === startsN.length - 1) ? 117 : startsN[startIdx + 1] - 1;
    const toSo = (s === e) ? String(s).padStart(2, '0') : (String(s).padStart(2, '0') + '-' + String(e).padStart(2, '0'));
    startIdx++;

    let so = row.so;
    let d = row.d;
    let ty = row.ty;
    let tg = row.tg;
    let loaiBan = row.loaiBan;
    let files = [row.p];

    if (row.p === '037.jpg' && (so === '94/TB-UBND' || so.includes('94'))) so = '34/TB-UBND';
    if (row.p === '038.jpg' && (so === '30/TB-UBND' || so.includes('30'))) so = '35/TB-UBND';
    if (row.p === '039.jpg' && (so === '30/TB-PCTT' || so.includes('30'))) so = '36/TB-PCTT';
    if (row.p === '065.jpg' && (so === '61/TB-UBND' || so.includes('61'))) so = '62/TB-UBND';
    if (row.p === '066.jpg') {
      so = '';
      if (!ty) ty = 'Thông báo danh sách những người trúng cử Trưởng ấp lần thứ VIII, nhiệm kỳ 2017-2020';
      if (!d) d = '22/10/2017';
    }
    if (row.p === '070.jpg') {
      files = ['070.jpg', '071.jpg'];
    }

    rowsN.push({ p: row.p, so, d, ty, tg, toSo, loaiBan, files });
  }

  await processDossier({
    dosId: 'PL_2017_17N',
    title: 'Hồ sơ Thông báo năm 2017 xã Phú Lộc',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsN
  });

  // 2. Dossier PL_2017_17Q
  const wbQ = new ExcelJS.Workbook();
  await wbQ.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2017_17Q.xlsx'));
  const wsQ = wbQ.worksheets[0];
  const startsQ = [
    // 002-025: (24 items)
    1, 4, 7, 11, 17, 27, 31, 35, 36, 49, 51, 52, 53, 54, 55, 56, 57, 58, 59, 61, 66, 70, 74, 77,
    // 026-049: (24 items)
    79, 80, 81, 88, 93, 95, 100, 101, 105, 107, 111, 113, 115, 116, 117, 122, 125, 126, 131, 132, 135, 137, 141, 144,
    // 050-072: (23 items)
    147, 148, 157, 159, 160, 161, 162, 164, 165, 172, 190, 191, 193, 198, 200, 204, 207, 213, 219, 222, 226, 228, 240,
    // 073-095: (23 items)
    242, 243, 244, 245, 246, 247, 251, 252, 253, 254, 255, 257, 258, 262, 266, 268, 269, 270, 273, 274, 282, 287, 291
  ];

  const rowsQ = [];
  for (let i = 0; i < startsQ.length; i++) {
    const s = startsQ[i];
    const e = (i === startsQ.length - 1) ? 291 : startsQ[i + 1] - 1;
    const toSo = (s === e) ? String(s).padStart(2, '0') : (String(s).padStart(2, '0') + '-' + String(e).padStart(2, '0'));
    const photoIdx = i + 2;
    const p = String(photoIdx).padStart(3, '0') + '.jpg';
    const excelRowIdx = i + 7;
    const r = wsQ.getRow(excelRowIdx);
    let so = String(r.getCell(2).value || '').trim();
    let d = String(r.getCell(3).value || '').trim();
    let ty = String(r.getCell(4).value || '').trim();
    let tg = String(r.getCell(5).value || '').trim();
    let loaiBan = String(r.getCell(7).value || 'Bản gốc').trim();
    const files = [p];

    if (p === '055.jpg') {
      so = '';
      if (!ty) ty = 'Báo cáo tiến độ trong ngày bầu cử Trưởng ấp';
      if (!d) d = '22/10/2017';
    }

    rowsQ.push({ p, so, d, ty, tg, toSo, loaiBan, files });
  }

  await processDossier({
    dosId: 'PL_2017_17Q',
    title: 'Hồ sơ Báo cáo (Tập 02 - Quý 3 và Quý 4) năm 2017 xã Phú Lộc',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsQ
  });

  console.log('\n=== Batch 2017-5 Completed Successfully! ===');
}

run().catch(err => {
  console.error('Batch 2017-5 error:', err);
  process.exit(1);
});
