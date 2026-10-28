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
  // 1. PL_2015_15G (87 active rows, sheets 01-225)
  // =========================================================================
  console.log('\n--- Processing PL_2015_15G ---');
  const wb15G = new ExcelJS.Workbook();
  await wb15G.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15G.xlsx'));
  const ws15G = wb15G.worksheets[0];

  const starts15G = [
    [2, 1], [3, 3], [4, 7], [5, 8], [6, 9], [7, 11], [8, 12], [9, 13], [10, 17], [11, 18],
    [12, 25], [13, 29], [14, 30], [15, 33], [16, 36], [17, 39], [18, 40], [19, 42], [20, 43], [21, 44],
    [22, 52], [23, 53], [24, 60], [25, 64], [26, 65], [27, 66], [28, 67], [29, 68], [30, 74], [31, 75],
    [32, 76], [33, 77], [34, 78], [35, 83], [36, 85], [37, 88], [38, 98], [39, 101], [40, 103], [41, 105],
    [42, 107], [43, 112], [44, 114], [45, 115], [46, 119], [47, 120], [48, 123], [49, 124], [50, 126], [51, 127],
    [52, 129], [53, 132], [54, 135], [55, 140], [56, 142], [57, 144], [58, 145], [59, 148], [60, 152], [61, 158],
    [62, 159], [63, 162], [64, 166], [65, 167], [66, 175], [67, 178], [68, 179], [69, 181], [70, 183], [71, 185],
    [72, 186], [73, 188], [74, 189], [75, 190], [76, 202], [77, 203], [78, 204], [79, 207], [80, 212], [81, 213],
    [82, 215], [83, 216], [84, 217], [85, 221], [86, 222], [87, 223], [88, 225]
  ];

  const rowsConfig15G = [];
  for (let i = 0; i < starts15G.length; i++) {
    const [scanNum, s] = starts15G[i];
    const nextS = (i < starts15G.length - 1) ? starts15G[i+1][1] : 226;
    const e = nextS - 1;
    const toSo = formatRange(s, e);
    const rIdx = scanNum + 5; // row in raw excel (scan 002 is row 7)
    const row = ws15G.getRow(rIdx);

    let so = String(row.getCell(2).value || '').trim();
    let d = String(row.getCell(3).value || '').trim();
    let ty = String(row.getCell(4).value || '').trim();
    let tg = String(row.getCell(5).value || 'Ủy ban nhân dân xã Phú Lộc').trim();
    let loaiBan = String(row.getCell(7).value || 'Bản gốc').trim();

    // OCR cleanups
    so = so.replace(/\.\/BC/g, '/BC').replace(/:/g, '/').replace(/\.HĐNV/g, '/HĐNV');
    if (scanNum === 8) d = '15/02/2015';
    if (scanNum === 17) d = '16/03/2015';
    if (scanNum === 71) {
      so = '';
      d = '28/07/2015';
      ty = 'Báo cáo tổng hợp số lượng, chất lượng công chức năm 2015';
    }
    if (scanNum === 73) {
      so = '';
      d = '05/08/2015';
      ty = 'Hội nghị tổng kết 05 năm giai đoạn 2011-2015 về thực hiện chương trình MTQG xây dựng NTM xã Phú Lộc';
    }
    if (scanNum === 74) {
      so = '';
      d = '05/08/2015';
      ty = 'Chương trình tổng kết thực hiện mục tiêu chương trình "Nông nghiệp - Nông dân - Nông thôn" và xây dựng NTM 05 năm giai đoạn 2011-2015';
    }
    if (scanNum === 77) d = '10/08/2015';
    if (scanNum === 88) {
      so = '86/BC-UBND';
      d = '28/08/2015';
      ty = 'Báo cáo công tác phòng chống tham nhũng tháng 8 năm 2015';
    }

    rowsConfig15G.push({
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
    dosId: 'PL_2015_15G',
    title: 'BÁO CÁO',
    year: '2015',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsConfig15G
  });

  // =========================================================================
  // 2. PL_2015_15I (94 active rows, sheets 01-137)
  // =========================================================================
  console.log('\n--- Processing PL_2015_15I ---');
  const wb15I = new ExcelJS.Workbook();
  await wb15I.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15I.xlsx'));
  const ws15I = wb15I.worksheets[0];

  const starts15I = [
    [2, 1], [3, 3], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 13], [11, 14],
    [12, 16], [13, 18], [14, 19], [15, 20], [16, 22], [17, 23], [18, 24], [19, 25], [20, 26], [21, 28],
    [22, 29], [23, 31], [24, 32], [25, 33], [26, 40], [27, 41], [28, 43], [29, 44], [30, 45], [31, 46],
    [32, 48], [33, 50], [34, 51], [35, 52], [36, 53], [37, 54], [38, 55], [39, 56], [40, 57], [41, 58],
    [42, 59], [43, 61], [44, 62], [45, 63], [46, 65], [47, 66], [48, 68], [49, 69], [50, 70], [51, 71],
    [52, 73], [53, 74], [54, 75], [55, 76], [56, 77], [57, 78], [58, 80], [59, 84], [60, 85], [61, 86],
    [62, 87], [63, 88], [64, 90], [65, 91], [66, 93], [67, 94], [68, 95], [69, 96], [70, 97], [71, 99],
    [72, 100], [73, 101], [74, 102], [75, 103], [76, 104], [77, 105], [78, 106], [79, 107], [80, 108], [81, 109],
    [82, 110], [83, 111], [84, 113], [85, 114], [86, 120], [87, 124], [88, 125], [89, 126], [90, 128], [91, 130],
    [92, 131], [93, 132], [94, 136], [95, 137]
  ];

  const rowsConfig15I = [];
  for (let i = 0; i < starts15I.length; i++) {
    const [scanNum, s] = starts15I[i];
    const nextS = (i < starts15I.length - 1) ? starts15I[i+1][1] : 138;
    const e = nextS - 1;
    const toSo = formatRange(s, e);
    const rIdx = scanNum + 5; // row in raw excel (scan 002 is row 7)
    const row = ws15I.getRow(rIdx);

    let so = String(row.getCell(2).value || '').trim();
    let d = String(row.getCell(3).value || '').trim();
    let ty = String(row.getCell(4).value || '').trim();
    let tg = String(row.getCell(5).value || 'Ủy ban nhân dân xã Phú Lộc').trim();
    let loaiBan = String(row.getCell(7).value || 'Bản gốc').trim();

    // OCR cleanups
    so = so.replace(/\.\/UBND/g, '/UBND').replace(/UBND\/UBND/g, 'UBND').replace(/\.CV/g, '/CV');

    rowsConfig15I.push({
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
    dosId: 'PL_2015_15I',
    title: 'CÔNG VĂN ĐI',
    year: '2015',
    skipFiles: ['001.jpg'],
    rowsConfig: rowsConfig15I
  });

  // =========================================================================
  // 3. PL_2015_15L (100 active rows, sheets 01-339)
  // =========================================================================
  console.log('\n--- Processing PL_2015_15L ---');

  // Sync photo documents to Tl_loại_VP_Toàn_PL.xlsx (sheet Photo)
  await appendTaiLieuLoai({
    type: 'photo',
    soHoSo: 'PL_2015_15L',
    tenVanBan: 'Quyết định về việc tặng Giấy khen cho các tập thể và cá nhân có thành tích xuất sắc (13/QĐ-UBND ngày 06/11/2015)',
    lyDoTrung: 'Bản photo hồ sơ PL_2015_15L'
  });
  await appendTaiLieuLoai({
    type: 'photo',
    soHoSo: 'PL_2015_15L',
    tenVanBan: 'Báo cáo tự kiểm tra công tác thi đua, khen thưởng năm 2015 (129/BC-TĐKT ngày 16/11/2015)',
    lyDoTrung: 'Bản photo hồ sơ PL_2015_15L'
  });
  await appendTaiLieuLoai({
    type: 'photo',
    soHoSo: 'PL_2015_15L',
    tenVanBan: 'Thông báo kiểm tra công tác thi đua, khen thưởng năm 2015 (186/TB-TĐKT ngày 18/11/2015)',
    lyDoTrung: 'Bản photo hồ sơ PL_2015_15L'
  });
  await appendTaiLieuLoai({
    type: 'photo',
    soHoSo: 'PL_2015_15L',
    tenVanBan: 'Công văn về việc thực hiện kế hoạch kiểm tra công tác thi đua khen thưởng năm 2015 (1824/UBND-TĐKT ngày 12/11/2015)',
    lyDoTrung: 'Bản photo hồ sơ PL_2015_15L'
  });
  await appendTaiLieuLoai({
    type: 'photo',
    soHoSo: 'PL_2015_15L',
    tenVanBan: 'Báo cáo thành tích đề nghị tặng danh hiệu chiến sĩ thi đua cơ sở năm 2015 (ngày 25/12/2015)',
    lyDoTrung: 'Bản photo hồ sơ PL_2015_15L'
  });

  // Sync duplicate scan 102.jpg to Tl_loại_VP_Toàn_PL.xlsx (sheet Trùng)
  await appendTaiLieuLoai({
    type: 'trung',
    soHoSo: 'PL_2015_15L',
    tenVanBan: 'Bảng báo cáo thành tích đề nghị HĐTĐKT xã Phú Lộc tặng giấy khen - Lầu Say Còong (1948)',
    lyDoTrung: 'Trùng scan 101 hồ sơ PL_2015_15L'
  });

  const wb15L = new ExcelJS.Workbook();
  await wb15L.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15L.xlsx'));
  const ws15L = wb15L.worksheets[0];

  const starts15L = [
    [2, 1], [3, 4], [4, 6], [5, 10], [6, 16], [7, 17], [8, 18], [9, 19], [10, 20], [11, 21],
    [12, 22], [13, 34], [14, 44], [15, 46], [16, 48], [17, 50], [18, 52], [19, 54], [20, 56], [21, 58],
    [22, 60], [23, 66], [24, 69], [25, 70], [26, 72], [27, 73], [28, 74], [29, 85], [30, 98], [31, 101],
    [32, 107], [33, 110], [34, 114], [35, 116], [36, 121], [37, 122], [38, 123], [39, 125], [40, 127], [41, 130],
    [42, 149], [43, 152], [44, 153], [45, 158], [46, 162], [47, 163], [48, 165], [49, 168], [50, 170], [51, 172],
    [52, 232], [53, 233], [54, 234], [55, 238], [56, 240], [57, 242], [58, 245], [59, 247], [60, 249], [61, 251],
    [62, 253], [63, 255], [64, 256], [65, 258], [66, 260], [67, 262], [68, 267], [69, 269], [70, 273], [71, 274],
    [72, 276], [73, 279], [74, 282], [75, 284], [76, 286], [77, 287], [78, 291], [79, 293], [80, 298], [81, 299],
    [82, 300], [83, 301], [84, 307], [85, 309], [86, 312], [87, 315], [88, 318], [89, 321], [90, 323], [91, 325],
    [92, 327], [93, 328], [94, 330], [95, 333], [96, 334], [97, 335], [98, 336], [99, 337], [100, 338], [101, 339]
  ];

  const rowsConfig15L = [];
  for (let i = 0; i < starts15L.length; i++) {
    const [scanNum, s] = starts15L[i];
    const nextS = (i < starts15L.length - 1) ? starts15L[i+1][1] : 340;
    const e = nextS - 1;
    const toSo = formatRange(s, e);
    // In raw excel of 15L:
    // row 6 is header, row 7 is STT 1 (scan 001/002)
    // scan 002 is row 7 (STT 1 was for scan 001/002 merged/overwritten)
    // scan 003 is row 8 (STT 2)
    // so rIdx = scanNum + 5!
    const rIdx = scanNum + 5;
    const row = ws15L.getRow(rIdx);

    let so = String(row.getCell(2).value || '').trim();
    let d = String(row.getCell(3).value || '').trim();
    let ty = String(row.getCell(4).value || '').trim();
    let tg = String(row.getCell(5).value || 'Ủy ban nhân dân xã Phú Lộc').trim();
    let loaiBan = String(row.getCell(7).value || 'Bản gốc').trim();

    // Clean up loaiBan
    if (loaiBan.toLowerCase().includes('photo')) loaiBan = 'Photo';
    else if (loaiBan.toLowerCase().includes('chính')) loaiBan = 'Bản chính';
    else loaiBan = 'Bản gốc';

    rowsConfig15L.push({
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
    dosId: 'PL_2015_15L',
    title: 'HỒ SƠ KHEN THƯỞNG',
    year: '2015',
    skipFiles: ['001.jpg', '102.jpg'],
    rowsConfig: rowsConfig15L
  });

  console.log('\n========================================');
  console.log('Batch 2015-3 COMPLETED SUCCESSFULLY!');
  console.log('========================================');
}

run().catch(err => {
  console.error('ERROR in batch 2015-3:', err);
  process.exit(1);
});
