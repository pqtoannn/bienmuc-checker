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
  console.log('Building rows for PL_2016_16G...');
  const rawWbG = new ExcelJS.Workbook();
  await rawWbG.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2016_16G.xlsx'));
  const wsG = rawWbG.worksheets[0];

  // Sync duplicates to Tl_loại_VP_Toàn_PL.xlsx
  console.log('Syncing duplicates to Tl_loại_VP_Toàn_PL.xlsx...');
  await appendTaiLieuLoai({
    type: 'trung',
    soHoSo: 'PL_2016_16G',
    tenVanBan: 'Quyết định về việc điều động tiểu đội dân quân trực SSCĐ bảo vệ ANCT-TTATXH Đại hội đại biểu toàn quốc lần thứ XII của Đảng',
    lyDoTrung: 'Trùng hs PL_2016_16G (ảnh 008.jpg trùng ảnh 009.jpg)'
  });

  await appendTaiLieuLoai({
    type: 'trung',
    soHoSo: 'PL_2016_16G',
    tenVanBan: 'Quyết định về việc thành lập tổ tự kiểm tra công tác Thi đua - Khen thưởng năm 2015',
    lyDoTrung: 'Trùng hs PL_2016_16G (ảnh 038.jpg trùng ảnh 037.jpg)'
  });

  await appendTaiLieuLoai({
    type: 'trung',
    soHoSo: 'PL_2016_16G',
    tenVanBan: 'Quyết định về việc thành lập đoàn vận động thu hồi nợ nguồn nhân dân đóng góp xây dựng đường GTNT',
    lyDoTrung: 'Trùng hs PL_2016_16G (ảnh 161.jpg trùng ảnh 160.jpg)'
  });

  const { active, starts } = JSON.parse(fs.readFileSync('tests/inspect_batch2016_5/16G_final_starts.json', 'utf8'));

  const rowsConfigG = [];
  for (let i = 0; i < active.length; i++) {
    const item = active[i];
    const rawRow = wsG.getRow(item.r);

    let so = String(rawRow.getCell(2).value || '').trim();
    let d = String(rawRow.getCell(3).value || '').trim();
    let ty = String(rawRow.getCell(4).value || '').trim();
    let tg = String(rawRow.getCell(5).value || '').trim() || 'Ủy ban nhân dân xã Phú Lộc';
    let loaiBan = String(rawRow.getCell(7).value || '').trim() || 'Bản gốc';

    // Fix specific OCR text distortions
    if (item.img === '124.jpg') {
      so = '123/QĐ-UBND';
    } else if (item.img === '145.jpg') {
      so = '144/QĐ-UBND';
    } else if (item.img === '031.jpg' && !d) {
      d = '01/2016';
    }

    const s = starts[i];
    const e = (i === starts.length - 1) ? 267 : starts[i + 1] - 1;
    const toSo = formatRange(s, e);

    rowsConfigG.push({
      p: item.img,
      so,
      d,
      ty,
      tg,
      loaiBan,
      toSo
    });
  }

  await processDossier({
    dosId: 'PL_2016_16G',
    title: 'QUYẾT ĐỊNH',
    year: '2016',
    skipFiles: ['001.jpg', '008.jpg', '038.jpg', '161.jpg'],
    rowsConfig: rowsConfigG
  });
}

run().catch(console.error);
