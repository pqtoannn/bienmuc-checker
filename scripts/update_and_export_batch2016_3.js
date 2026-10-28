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
  // 1. PL_2016_16E
  // ----------------------------------------------------
  console.log('Building rows for PL_2016_16E...');
  const rawWbE = new ExcelJS.Workbook();
  await rawWbE.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2016_16E.xlsx'));
  const wsE = rawWbE.worksheets[0];
  const startsE = [1, 13, 19, 20, 22, 26, 27, 28, 29, 31, 33, 40, 42, 44, 46, 49, 56, 58, 61, 62, 63, 64, 65, 69, 70, 71, 72, 73, 78, 81, 85, 86, 87, 88, 90, 95, 98, 99, 100, 101, 102, 105, 106, 107, 108, 109, 110, 114, 119, 122, 125, 127, 128, 131, 132, 137, 167, 168, 169, 170, 173, 174, 176, 180, 182, 187, 188, 189, 191, 192, 196, 198];
  const finalSheetE = 201;

  const rowsConfigE = [];
  for (let i = 0; i < startsE.length; i++) {
    const s = startsE[i];
    const e = (i === startsE.length - 1) ? finalSheetE : startsE[i + 1] - 1;
    const toSo = formatRange(s, e);
    const rIdx = i + 8; // Row in raw excel (starts at 8 for 002.jpg)
    const rawRow = wsE.getRow(rIdx);
    const imgName = String(i + 2).padStart(3, '0') + '.jpg';

    let files = [imgName];
    if (i === startsE.length - 1) {
      files = [imgName, '074.jpg']; // 074.jpg is merged table
    }

    rowsConfigE.push({
      p: imgName,
      files: files,
      so: rawRow.getCell(2).text?.trim() || '',
      d: rawRow.getCell(3).text?.trim() || '',
      ty: rawRow.getCell(4).text?.trim() || '',
      tg: rawRow.getCell(5).text?.trim() || 'Ủy ban nhân dân xã Phú Lộc',
      toSo: toSo,
      loaiBan: rawRow.getCell(7).text?.trim() || 'Bản gốc'
    });
  }

  await processDossier({
    dosId: 'PL_2016_16E',
    title: 'BÁO CÁO',
    year: '2016',
    skipFiles: ['001.jpg', '074.jpg'],
    rowsConfig: rowsConfigE
  });

  // ----------------------------------------------------
  // 2. PL_2016_16B
  // ----------------------------------------------------
  console.log('Building rows for PL_2016_16B...');
  const rawWbB = new ExcelJS.Workbook();
  await rawWbB.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2016_16B.xlsx'));
  const wsB = rawWbB.worksheets[0];

  // 067.jpg is duplicate of 066.jpg
  await appendTaiLieuLoai({
    type: 'trung',
    soHoSo: 'PL_2016_16B',
    tenVanBan: 'Kế hoạch thực hiện đề án “Nâng cao tính tiền phương, gương mẫu của cán bộ, đảng viên”',
    lyDoTrung: 'Trùng hs PL_2016_16B (ảnh 067.jpg trùng ảnh 066.jpg)'
  });

  const startsB = [1, 4, 6, 8, 10, 11, 13, 14, 15, 17, 19, 22, 25, 27, 29, 32, 34, 36, 38, 41, 43, 45, 47, 48, 50, 53, 54, 55, 61, 65, 69, 71, 73, 75, 77, 78, 79, 81, 83, 86, 91, 94, 95, 97, 99, 101, 107, 111, 114, 118, 120, 123, 128, 131, 134, 136, 140, 146, 149, 152, 157, 159, 162, 164, 166, 169, 173, 176, 178, 181, 183, 185, 187, 189, 193, 196, 198, 200];
  const finalSheetB = 206;

  const rowsConfigB = [];
  let currentRawRowB = 8;
  for (let i = 0; i < startsB.length; i++) {
    const s = startsB[i];
    const e = (i === startsB.length - 1) ? finalSheetB : startsB[i + 1] - 1;
    const toSo = formatRange(s, e);
    
    // Determine image name
    let imgIdx = i + 2;
    if (i >= 65) {
      imgIdx = i + 3; // Shift by 1 because 067.jpg is skipped duplicate!
    }
    const imgName = String(imgIdx).padStart(3, '0') + '.jpg';

    // In raw excel, row 73 was 067.jpg duplicate, row 87 was 081.jpg
    if (currentRawRowB === 73) {
      currentRawRowB++; // Skip raw row 73 (067.jpg)
    }

    const rawRow = wsB.getRow(currentRawRowB);
    currentRawRowB++;

    let files = [imgName];
    if (i === startsB.length - 1) {
      files = [imgName, '081.jpg']; // 081.jpg is concluding sheet
    }

    let so = rawRow.getCell(2).text?.trim() || '';
    let d = rawRow.getCell(3).text?.trim() || '';
    let ty = rawRow.getCell(4).text?.trim() || '';
    let tg = rawRow.getCell(5).text?.trim() || 'Ủy ban nhân dân xã Phú Lộc';
    let loaiBan = rawRow.getCell(7).text?.trim() || 'Bản gốc';

    // Specific corrections for 16B if needed
    if (imgName === '080.jpg') {
      so = '81/KH-UBND';
      d = '22/12/2016';
    }

    rowsConfigB.push({
      p: imgName,
      files: files,
      so: so,
      d: d,
      ty: ty,
      tg: tg,
      toSo: toSo,
      loaiBan: loaiBan
    });
  }

  await processDossier({
    dosId: 'PL_2016_16B',
    title: 'KẾ HOẠCH',
    year: '2016',
    skipFiles: ['001.jpg', '067.jpg', '081.jpg'],
    rowsConfig: rowsConfigB
  });

  // ----------------------------------------------------
  // 3. PL_2016_16K
  // ----------------------------------------------------
  console.log('Building rows for PL_2016_16K...');
  const rawWbK = new ExcelJS.Workbook();
  await rawWbK.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2016_16K.xlsx'));
  const wsK = rawWbK.worksheets[0];

  // 001.jpg is duplicate scrap-covered image of 002.jpg
  await appendTaiLieuLoai({
    type: 'trung',
    soHoSo: 'PL_2016_16K',
    tenVanBan: 'Công văn về việc đăng ký thi đua năm 2016 (Bản có giấy kẹp che tiêu đề)',
    lyDoTrung: 'Trùng hs PL_2016_16K (ảnh 001.jpg trùng ảnh 002.jpg)'
  });

  const startsK = [1, 4, 8, 9, 15, 16, 21, 23, 32, 35, 48, 50, 53, 58, 62, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 91, 92, 93, 94, 95, 96, 97, 98, 105, 109, 113, 117, 121, 125, 126, 128, 130, 141, 143, 145, 155, 164, 167, 181, 184, 186, 188, 198, 200, 202, 204, 206, 208, 210, 214, 216, 218, 220, 241, 260, 261, 262, 288, 289, 290, 291, 293, 294, 301, 309, 311, 316, 318, 322, 327, 330, 335, 336, 341, 344, 349, 350, 352, 354];
  const finalSheetK = 354;

  const rowsConfigK = [];
  for (let i = 0; i < startsK.length; i++) {
    const s = startsK[i];
    const e = (i === startsK.length - 1) ? finalSheetK : startsK[i + 1] - 1;
    const toSo = formatRange(s, e);
    const rIdx = i + 8; // Row in raw excel (row 7 was 001.jpg, row 8 is 002.jpg)
    const rawRow = wsK.getRow(rIdx);
    const imgName = String(i + 2).padStart(3, '0') + '.jpg';

    rowsConfigK.push({
      p: imgName,
      files: [imgName],
      so: rawRow.getCell(2).text?.trim() || '',
      d: rawRow.getCell(3).text?.trim() || '',
      ty: rawRow.getCell(4).text?.trim() || '',
      tg: rawRow.getCell(5).text?.trim() || 'Ủy ban nhân dân xã Phú Lộc',
      toSo: toSo,
      loaiBan: rawRow.getCell(7).text?.trim() || 'Bản chính'
    });
  }

  await processDossier({
    dosId: 'PL_2016_16K',
    title: 'THI ĐUA KHEN THƯỞNG NĂM 2016',
    year: '2016',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsConfigK
  });

  console.log('\nALL 3 DOSSIERS IN BATCH 2016-3 PROCESSED SUCCESSFULLY!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
