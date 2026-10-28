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
          im.skipReason = 'Bìa hồ sơ hoặc tờ chốt đính kèm / trùng lặp / tờ ngăn cách';
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
  // 1. PL_2015_15M (4 active rows, sheets 01-15)
  // ----------------------------------------------------
  console.log('\n--- Processing PL_2015_15M ---');
  // Sync photo documents to Tl_loại_VP_Toàn_PL.xlsx (sheet Photo)
  await appendTaiLieuLoai({
    type: 'photo',
    soHoSo: 'PL_2015_15M',
    tenVanBan: 'KẾ HOẠCH thực hiện năm "KỶ CƯƠNG HÀNH CHÍNH, ĐẠO ĐỨC CÔNG VỤ" trong thi hành nhiệm vụ của cán bộ, công chức, viên chức (18/KH-UBND ngày 23/01/2015)',
    lyDoTrung: 'Bản photo hồ sơ PL_2015_15M'
  });
  await appendTaiLieuLoai({
    type: 'photo',
    soHoSo: 'PL_2015_15M',
    tenVanBan: 'Quyết định về việc thành lập Tổ kiểm tra "KỶ CƯƠNG HÀNH CHÍNH, ĐẠO ĐỨC CÔNG VỤ" đối với cán bộ, công chức, viên chức trên địa bàn huyện (20/QĐ-UBND ngày 03/02/2015)',
    lyDoTrung: 'Bản photo hồ sơ PL_2015_15M'
  });

  const rowsConfig15M = [
    {
      p: '002.jpg',
      so: '18/KH-UBND',
      d: '23/01/2015',
      ty: 'Kế hoạch thực hiện năm "KỶ CƯƠNG HÀNH CHÍNH, ĐẠO ĐỨC CÔNG VỤ" trong thi hành nhiệm vụ của cán bộ, công chức, viên chức',
      tg: 'Ủy ban nhân dân huyện Tân Phú',
      loaiBan: 'Photo',
      toSo: '01-04'
    },
    {
      p: '003.jpg',
      so: '13/KH-UBND',
      d: '04/02/2015',
      ty: 'Kế hoạch thực hiện năm “KỶ CƯƠNG HÀNH CHÍNH, ĐẠO ĐỨC CÔNG VỤ” trong thi hành nhiệm vụ của cán bộ, công chức xã Phú Lộc',
      tg: 'Ủy ban nhân dân xã Phú Lộc',
      loaiBan: 'Bản gốc',
      toSo: '05-10'
    },
    {
      p: '004.jpg',
      so: '20/QĐ-UBND',
      d: '03/02/2015',
      ty: 'Quyết định về việc thành lập Tổ kiểm tra “KỶ CƯƠNG HÀNH CHÍNH, ĐẠO ĐỨC CÔNG VỤ” đối với cán bộ, công chức, viên chức trên địa bàn huyện',
      tg: 'Ủy ban nhân dân huyện Tân Phú',
      loaiBan: 'Photo',
      toSo: '11-12'
    },
    {
      files: ['005.jpg', '006.jpg'],
      so: '68/KH-UBND',
      d: '30/12/2015',
      ty: 'KẾ HOẠCH Thực hiện năm “KỶ CƯƠNG HÀNH CHÍNH, ĐẠO ĐỨC CÔNG VỤ” trong thi hành nhiệm vụ của cán bộ, công chức xã Phú Lộc',
      tg: 'Ủy ban nhân dân xã Phú Lộc',
      loaiBan: 'Bản chính',
      toSo: '13-15'
    }
  ];

  await processDossier({
    dosId: 'PL_2015_15M',
    title: 'KẾ HOẠCH - QUYẾT ĐỊNH',
    year: '2015',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsConfig15M
  });

  // ----------------------------------------------------
  // 2. PL_2015_15J (13 active rows, sheets 01-33)
  // ----------------------------------------------------
  console.log('\n--- Processing PL_2015_15J ---');
  const rawWbJ = new ExcelJS.Workbook();
  await rawWbJ.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15J.xlsx'));
  const wsJ = rawWbJ.worksheets[0];

  const startsJ = [1, 3, 7, 11, 13, 16, 18, 20, 22, 24, 26, 30, 33];
  const rowsConfig15J = [];

  for (let i = 0; i < startsJ.length; i++) {
    const rawRow = wsJ.getRow(i + 7); // Row 7 is STT 2 (first active row)
    const scanNum = i + 2;
    const img = String(scanNum).padStart(3, '0') + '.jpg';
    const s = startsJ[i];
    const e = (i === startsJ.length - 1) ? 33 : startsJ[i + 1] - 1;

    let so = String(rawRow.getCell(2).value || '').trim();
    let d = String(rawRow.getCell(3).value || '').trim();
    let ty = String(rawRow.getCell(4).value || '').trim();
    let tg = String(rawRow.getCell(5).value || '').trim() || 'Ủy ban nhân dân xã Phú Lộc';
    let loaiBan = String(rawRow.getCell(7).value || '').trim() || 'Bản gốc';

    rowsConfig15J.push({
      p: img,
      so,
      d,
      ty,
      tg,
      loaiBan,
      toSo: formatRange(s, e)
    });
  }

  await processDossier({
    dosId: 'PL_2015_15J',
    title: 'QUYẾT ĐỊNH KHEN THƯỞNG',
    year: '2015',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsConfig15J
  });

  // ----------------------------------------------------
  // 3. PL_2015_15B (14 active rows, sheets 01-29)
  // ----------------------------------------------------
  console.log('\n--- Processing PL_2015_15B ---');
  // Sync duplicate 014.jpg to Tl_loại_VP_Toàn_PL.xlsx (Trùng)
  await appendTaiLieuLoai({
    type: 'trung',
    soHoSo: 'PL_2015_15B',
    tenVanBan: 'Dự án nhân rộng mô hình nuôi dê sinh sản năm 2015 cho hộ nghèo xã Phú Lộc (01/DA-UBND)',
    lyDoTrung: 'Trùng hs PL_2015_15B (ảnh 014.jpg trùng ảnh 013.jpg)'
  });

  const rawWbB = new ExcelJS.Workbook();
  await rawWbB.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15B.xlsx'));
  const wsB = rawWbB.worksheets[0];

  // Scans: 002 to 016, excluding 001 (cover) and 014 (duplicate of 013)
  const activeScansB = [
    { p: '002.jpg', r: 7, s: 1, e: 2 },
    { p: '003.jpg', r: 8, s: 3, e: 5 },
    { p: '004.jpg', r: 9, s: 6, e: 6 },
    { p: '005.jpg', r: 10, s: 7, e: 7 },
    { p: '006.jpg', r: 11, s: 8, e: 9 },
    { p: '007.jpg', r: 12, s: 10, e: 11 },
    { p: '008.jpg', r: 13, s: 12, e: 13 },
    { p: '009.jpg', r: 14, s: 14, e: 15 },
    { p: '010.jpg', r: 15, s: 16, e: 18 },
    { p: '011.jpg', r: 16, s: 19, e: 19 },
    { p: '012.jpg', r: 17, s: 20, e: 23 },
    { p: '013.jpg', r: 18, s: 24, e: 25 },
    // 014 is skipped duplicate
    { p: '015.jpg', r: 20, s: 26, e: 28 },
    { p: '016.jpg', r: 21, s: 29, e: 29 }
  ];

  const rowsConfig15B = [];
  for (const item of activeScansB) {
    const rawRow = wsB.getRow(item.r);
    let so = String(rawRow.getCell(2).value || '').trim();
    let d = String(rawRow.getCell(3).value || '').trim();
    let ty = String(rawRow.getCell(4).value || '').trim();
    let tg = String(rawRow.getCell(5).value || '').trim() || 'Ủy ban nhân dân xã Phú Lộc';
    let loaiBan = String(rawRow.getCell(7).value || '').trim() || 'Bản gốc';

    if (item.p === '003.jpg' && !d) d = '01/2015';
    if (item.p === '013.jpg') so = '01/DA-UBND';

    rowsConfig15B.push({
      p: item.p,
      so,
      d,
      ty,
      tg,
      loaiBan,
      toSo: formatRange(item.s, item.e)
    });
  }

  await processDossier({
    dosId: 'PL_2015_15B',
    title: 'VĂN BẢN CÁC LOẠI',
    year: '2015',
    skipFiles: ['001.jpg', '014.jpg'],
    rowsConfig: rowsConfig15B
  });

  // ----------------------------------------------------
  // 4. PL_2015_15A (40 active rows, sheets 01-49)
  // ----------------------------------------------------
  console.log('\n--- Processing PL_2015_15A ---');
  // Sync photo document 011.jpg to sheet Photo in Tl_loại_VP_Toàn_PL.xlsx
  await appendTaiLieuLoai({
    type: 'photo',
    soHoSo: 'PL_2015_15A',
    tenVanBan: 'Biên bản về việc bàn giao một số điểm trường tiểu học Phạm Văn Đồng cho UBND xã Phú Lộc, quản lý và sử dụng (25/12/2015)',
    lyDoTrung: 'Bản sao/photo hồ sơ PL_2015_15A'
  });

  const rawWbA = new ExcelJS.Workbook();
  await rawWbA.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15A.xlsx'));
  const wsA = rawWbA.worksheets[0];

  const skipSttA = [1, 12, 14, 17, 35, 39]; // Raw Excel STT
  const startsA = [
    1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 
    12, 17, 18, 19, 20, 21, 22, 23, 24, 25, 
    26, 28, 29, 30, 31, 32, 33, 34, 36, 37, 
    38, 40, 41, 42, 44, 45, 46, 47, 48, 49
  ];

  const rowsConfig15A = [];
  let aIdx = 0;
  for (let r = 6; r <= wsA.rowCount; r++) {
    const row = wsA.getRow(r);
    const stt = row.getCell(1).value;
    if (stt === null || stt === undefined || String(stt).trim() === '') continue;
    const sttNum = parseInt(String(stt).trim(), 10);
    const img = String(sttNum).padStart(3, '0') + '.jpg';
    if (skipSttA.includes(sttNum)) continue;

    let so = String(row.getCell(2).value || '').trim();
    let d = String(row.getCell(3).value || '').trim();
    let ty = String(row.getCell(4).value || '').trim();
    let tg = String(row.getCell(5).value || '').trim() || 'Ủy ban nhân dân xã Phú Lộc';
    let loaiBan = String(row.getCell(7).value || '').trim() || 'Bản gốc';

    if (img === '046.jpg') so = '06/TB-UBND';

    const s = startsA[aIdx];
    const e = (aIdx === startsA.length - 1) ? 49 : startsA[aIdx + 1] - 1;
    aIdx++;

    rowsConfig15A.push({
      p: img,
      so,
      d,
      ty,
      tg,
      loaiBan,
      toSo: formatRange(s, e)
    });
  }

  await processDossier({
    dosId: 'PL_2015_15A',
    title: 'BIÊN BẢN',
    year: '2015',
    skipFiles: ['001.jpg', '012.jpg', '014.jpg', '017.jpg', '035.jpg', '039.jpg'],
    rowsConfig: rowsConfig15A
  });
}

run().catch(console.error);
