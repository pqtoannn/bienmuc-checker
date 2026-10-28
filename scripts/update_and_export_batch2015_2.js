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
  // =========================================================================
  // 1. PL_2015_15E (54 active rows, sheets 01-78)
  // =========================================================================
  console.log('\n--- Processing PL_2015_15E ---');
  const wb15E = new ExcelJS.Workbook();
  await wb15E.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15E.xlsx'));
  const ws15E = wb15E.worksheets[0];

  const starts15E = [
    [2, 1], [3, 2], [4, 4], [5, 5], [6, 6], [7, 7], [8, 9], [9, 10], [10, 11], [11, 12],
    [12, 13], [13, 14], [14, 16], [15, 17], [16, 20], [17, 21], [18, 23], [19, 25], [20, 27], [21, 28],
    [22, 29], [23, 30], [24, 32], [25, 33], [26, 34], [27, 35], [28, 36], [29, 37], [30, 38], [31, 39],
    [32, 40], [33, 41], [34, 43], [35, 45], [36, 47], [37, 48], [38, 49], [39, 50], [40, 51], [41, 54],
    [42, 55], [43, 57], [44, 58], [45, 59], [46, 60], [47, 61], [48, 62], [49, 63], [50, 64], [51, 67],
    [52, 68], [53, 72], [54, 73], [55, 78]
  ];

  const rowsConfig15E = [];
  for (let i = 0; i < starts15E.length; i++) {
    const [scanNum, s] = starts15E[i];
    const nextS = (i < starts15E.length - 1) ? starts15E[i+1][1] : 79;
    const e = nextS - 1;
    const toSo = formatRange(s, e);
    const rIdx = scanNum + 5; // row in raw excel (scan 002 is row 7)
    const row = ws15E.getRow(rIdx);

    let so = String(row.getCell(2).value || '').trim();
    let d = String(row.getCell(3).value || '').trim();
    let ty = String(row.getCell(4).value || '').trim();
    let tg = String(row.getCell(5).value || 'Ủy ban nhân dân xã Phú Lộc').trim();
    let loaiBan = String(row.getCell(7).value || 'Bản gốc').trim();

    // Fix OCR typos
    so = so.replace(/\.\/TB/g, '/TB').replace(/\/TB\/UBND/g, '/TB-UBND').replace(/TB\/UBND/g, 'TB-UBND');
    if (so === '2/TB-UBND') so = '22/TB-UBND';
    if (so === '43 TB-UBND') so = '43/TB-UBND';

    rowsConfig15E.push({
      p: String(scanNum).padStart(3, '0') + '.jpg',
      so,
      d,
      ty,
      tg,
      loaiBan,
      toSo
    });
  }

  await processDossier({
    dosId: 'PL_2015_15E',
    title: 'THÔNG BÁO',
    year: '2015',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsConfig15E
  });

  // =========================================================================
  // 2. PL_2015_15H (63 active rows, sheets 01-208)
  // =========================================================================
  console.log('\n--- Processing PL_2015_15H ---');
  // Sync duplicate 043.jpg to Tl_loại_VP_Toàn_PL.xlsx (sheet Trùng)
  await appendTaiLieuLoai({
    type: 'trung',
    soHoSo: 'PL_2015_15H',
    tenVanBan: 'Báo cáo kết quả bảng điểm đánh giá, phân loại chính quyền cơ sở năm 2015 (121/BC-UBND ngày 09/11/2015)',
    lyDoTrung: 'Trùng scan 042 hồ sơ PL_2015_15H'
  });

  const wb15H = new ExcelJS.Workbook();
  await wb15H.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15H.xlsx'));
  const ws15H = wb15H.worksheets[0];

  const starts15H = [
    { scan: 2, s: 1 },
    { scan: 3, s: 7 },
    { scan: 4, s: 8 },
    { scan: 5, s: 10 },
    { scan: 6, s: 13 },
    { scan: 7, s: 15 },
    { scan: 8, s: 18 },
    { scan: 9, s: 20 },
    { scan: 10, s: 21 },
    { scan: 11, s: 22 },
    { scan: 12, s: 23 },
    { scan: 13, s: 25 },
    { scan: 14, s: 26 },
    { scan: 15, s: 39 },
    { scan: 16, s: 40 },
    { scan: 17, s: 41 },
    { scan: 18, s: 55 },
    { scan: 19, s: 57 },
    { scan: [20, 21], s: 58 }, // merged
    { scan: 22, s: 59 },
    { scan: 23, s: 61 },
    { scan: 24, s: 63 },
    { scan: 25, s: 64 },
    { scan: 26, s: 66 },
    { scan: 27, s: 68 },
    { scan: 28, s: 70 },
    { scan: 29, s: 72 },
    { scan: 30, s: 74 },
    { scan: 31, s: 77 },
    { scan: 32, s: 79 },
    { scan: 33, s: 80 },
    { scan: 34, s: 88 },
    { scan: 35, s: 89 },
    { scan: 36, s: 90 },
    { scan: 37, s: 100 },
    { scan: 38, s: 101 },
    { scan: 39, s: 102 },
    { scan: 40, s: 103 },
    { scan: 41, s: 127 },
    { scan: 42, s: 130 }, // scan 43 skipped
    { scan: 44, s: 147 },
    { scan: 45, s: 152 },
    { scan: 46, s: 154 },
    { scan: 47, s: 155 },
    { scan: 48, s: 163 },
    { scan: 49, s: 167 },
    { scan: 50, s: 170 },
    { scan: 51, s: 173 },
    { scan: 52, s: 177 },
    { scan: 53, s: 178 },
    { scan: 54, s: 179 },
    { scan: 55, s: 182 },
    { scan: 56, s: 184 },
    { scan: 57, s: 185 },
    { scan: 58, s: 186 },
    { scan: 59, s: 187 },
    { scan: 60, s: 188 },
    { scan: 61, s: 191 },
    { scan: 62, s: 192 },
    { scan: 63, s: 195 },
    { scan: 64, s: 199 },
    { scan: 65, s: 201 },
    { scan: 66, s: 208 }
  ];

  const rowsConfig15H = [];
  for (let i = 0; i < starts15H.length; i++) {
    const item = starts15H[i];
    const s = item.s;
    const nextS = (i < starts15H.length - 1) ? starts15H[i+1].s : 209;
    const e = nextS - 1;
    const toSo = formatRange(s, e);

    if (Array.isArray(item.scan)) {
      // 020 + 021 merged
      const row20 = ws15H.getRow(25);
      rowsConfig15H.push({
        files: ['020.jpg', '021.jpg'],
        so: '',
        d: '28/09/2015',
        ty: 'Báo cáo thành tích đề nghị UBND huyện tặng giấy khen (kèm phụ lục chỉ tiêu xã Phú Lộc)',
        tg: 'Ủy ban nhân dân xã Phú Lộc',
        loaiBan: 'Bản gốc',
        toSo
      });
    } else {
      const scanNum = item.scan;
      const rIdx = scanNum + 5;
      const row = ws15H.getRow(rIdx);

      let so = String(row.getCell(2).value || '').trim();
      let d = String(row.getCell(3).value || '').trim();
      let ty = String(row.getCell(4).value || '').trim();
      let tg = String(row.getCell(5).value || 'Ủy ban nhân dân xã Phú Lộc').trim();
      let loaiBan = String(row.getCell(7).value || 'Bản gốc').trim();

      // Text cleanups
      if (scanNum === 4) so = '86/BC-UBND';
      if (scanNum === 17) so = '98/BC-UBND';
      if (scanNum === 18) d = '24/09/2015';
      if (scanNum === 34) {
        so = '112A/BC-UBND';
        ty = 'Báo cáo các công trình điện và nước sinh hoạt trên địa bàn xã Phú Lộc';
      }
      if (scanNum === 35) d = '26/10/2015';
      if (scanNum === 36) d = '28/10/2015';
      if (scanNum === 58) d = '27/11/2015';
      if (scanNum === 64) so = '147/BC-UBND';

      rowsConfig15H.push({
        p: String(scanNum).padStart(3, '0') + '.jpg',
        so,
        d,
        ty,
        tg,
        loaiBan,
        toSo
      });
    }
  }

  await processDossier({
    dosId: 'PL_2015_15H',
    title: 'BÁO CÁO',
    year: '2015',
    skipFiles: ['001.jpg', '043.jpg'],
    rowsConfig: rowsConfig15H
  });

  // =========================================================================
  // 3. PL_2015_15C (71 active rows, sheets 01-183)
  // =========================================================================
  console.log('\n--- Processing PL_2015_15C ---');
  const wb15C = new ExcelJS.Workbook();
  await wb15C.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15C.xlsx'));
  const ws15C = wb15C.worksheets[0];

  const starts15C = [
    [2, 1], [3, 3], [4, 5], [5, 7], [6, 11], [7, 13], [8, 15], [9, 17], [10, 19], [11, 22],
    [12, 24], [13, 27], [14, 29], [15, 35], [16, 37], [17, 39], [18, 43], [19, 46], [20, 48], [21, 51],
    [22, 53], [23, 55], [24, 57], [25, 58], [26, 59], [27, 62], [28, 64], [29, 66], [30, 70], [31, 71],
    [32, 73], [33, 78], [34, 83], [35, 84], [36, 87], [37, 88], [38, 91], [39, 93], [40, 95], [41, 98],
    [42, 100], [43, 102], [44, 103], [45, 104], [46, 105], [47, 107], [48, 108], [49, 110], [50, 112], [51, 115],
    [52, 117], [53, 119], [54, 122], [55, 124], [56, 128], [57, 130], [58, 131], [59, 134], [60, 140], [61, 142],
    [62, 144], [63, 149], [64, 154], [65, 156], [66, 158], [67, 160], [68, 161], [69, 164], [70, 167], [71, 170],
    [72, 183]
  ];

  const rowsConfig15C = [];
  for (let i = 0; i < starts15C.length; i++) {
    const [scanNum, s] = starts15C[i];
    const nextS = (i < starts15C.length - 1) ? starts15C[i+1][1] : 184;
    const e = nextS - 1;
    const toSo = formatRange(s, e);
    const rIdx = scanNum + 5; // row in raw excel (scan 002 is row 7)
    const row = ws15C.getRow(rIdx);

    let so = String(row.getCell(2).value || '').trim();
    let d = String(row.getCell(3).value || '').trim();
    let ty = String(row.getCell(4).value || '').trim();
    let tg = String(row.getCell(5).value || 'Ủy ban nhân dân xã Phú Lộc').trim();
    let loaiBan = String(row.getCell(7).value || 'Bản gốc').trim();

    // Specific field corrections for 15C
    if (scanNum === 12) d = '02/02/2015';
    if (scanNum === 16) d = '02/2015';
    if (scanNum === 70) d = '12/2015';
    if (scanNum === 71) d = '2015';
    if (scanNum === 72) {
      so = '';
      d = '2015';
      ty = 'Bản cam kết không vi phạm pháp luật về phòng, chống tham nhũng (Nguyễn Thanh Sang)';
      tg = 'Nguyễn Thanh Sang';
    }

    rowsConfig15C.push({
      p: String(scanNum).padStart(3, '0') + '.jpg',
      so,
      d,
      ty,
      tg,
      loaiBan,
      toSo
    });
  }

  await processDossier({
    dosId: 'PL_2015_15C',
    title: 'KẾ HOẠCH',
    year: '2015',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsConfig15C
  });

  console.log('\n========================================');
  console.log('Batch 2015-2 COMPLETED SUCCESSFULLY!');
  console.log('========================================');
}

run().catch(err => {
  console.error('ERROR in batch 2015-2:', err);
  process.exit(1);
});
