import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const pad = (n) => String(n).padStart(2, '0');

// ==========================================
// 1. PROCESS PL_2019_19S
// ==========================================
async function process19S() {
  console.log('\n>>> PROCESSING PL_2019_19S...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19S.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Đánh giá cán bộ, công chức năm 2019 xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19S';
  job.data.soKyHieuHoSo = 'PL_2019_19S';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2019';
  job.data.thoiGianHoSo = 'Từ ngày 23/12/2015 đến ngày 17/01/2020';
  job.data.thbq = 'Vĩnh viễn';

  // 19S has 56 photos:
  // 001.jpg is cover folder ("Hồ sơ ĐG.CBCC năm 2019") -> SKIP!
  // Photos 002 to 054 are individual active docs.
  // Photos 055 + 056 are two pages of the same doc (Trương Khánh Linh).
  const starts19S = {
    2: 1, 3: 4, 4: 7, 5: 16, 6: 20, 7: 22, 8: 25, 9: 26, 10: 29,
    11: 32, 12: 35, 13: 38, 14: 41, 15: 44, 16: 46, 17: 48, 18: 52, 19: 57, 20: 62,
    21: 66, 22: 71, 23: 75, 24: 78, 25: 86, 26: 87, 27: 95, 28: 105, 29: 107, 30: 109,
    31: 111, 32: 113, 33: 115, 34: 116, 35: 119, 36: 122, 37: 125, 38: 128, 39: 130, 40: 133,
    41: 136, 42: 139, 43: 142, 44: 145, 45: 148, 46: 151, 47: 153, 48: 154, 49: 155, 50: 167,
    51: 169, 52: 172, 53: 174, 54: 176, 55: 178
  };

  const ends19S = {};
  for (let i = 2; i <= 55; i++) {
    if (i === 55) {
      ends19S[i] = 179; // Merged with 056.jpg which ends at 179
    } else {
      ends19S[i] = starts19S[i + 1] - 1;
    }
  }

  // Update images list: photo 001 skipped
  if (job.images) {
    job.images.forEach(img => {
      const fn = img.fileName || img.file_name || '';
      if (fn === '001.jpg') {
        img.status = 'skip';
        img.isExcluded = true;
        img.excludeReason = 'Bìa hồ sơ lưu trữ';
      } else {
        img.status = 'ok';
        img.isExcluded = false;
      }
    });
  }

  const activeRows = [];
  let sttCounter = 1;

  for (let photoNum = 2; photoNum <= 55; photoNum++) {
    const fn = `${String(photoNum).padStart(3, '0')}.jpg`;
    const origRow = (job.data.rows && job.data.rows[photoNum - 1]) ? job.data.rows[photoNum - 1] : {};

    const startSheet = starts19S[photoNum];
    const endSheet = ends19S[photoNum];
    const toSoStr = startSheet === endSheet ? pad(startSheet) : `${pad(startSheet)}-${pad(endSheet)}`;

    let trichYeu = origRow.tenLoaiTrichYeu || '';
    let tacGia = origRow.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc';
    let soKyHieu = origRow.soKyHieuVanBan || '';
    let ngayThang = origRow.ngayThangVanBan || '';
    let loaiBan = origRow.loaiBan || 'Bản gốc';

    // Source files for row
    const sourceFiles = (photoNum === 55) ? ['055.jpg', '056.jpg'] : [fn];

    if (photoNum === 55) {
      trichYeu = 'Phiếu đánh giá và phân loại cán bộ không chuyên trách xã năm 2019 của Trương Khánh Linh';
      ngayThang = '09/12/2019';
    }

    const row = {
      soTT: String(sttCounter++),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: ngayThang,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: toSoStr,
      loaiBan: loaiBan,
      ghiChu: '',
      banGocChinh: (loaiBan === 'Photo' ? '' : loaiBan),
      banSao: (loaiBan === 'Photo' ? 'Photo' : ''),
      doMat: '',
      sourceFileNames: sourceFiles
    };

    activeRows.push(row);
  }

  job.data.rows = activeRows;
  job.data.rowsTrung = [];
  job.status = 'done';
  job.exportedFileName = 'PL_2019_19S.xlsx';

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Updated ${jobPath} with ${activeRows.length} active rows, sheets 01-179.`);

  const daCheckFile = path.join(DA_CHECK_DIR, 'PL_2019_19S.xlsx');
  const outputOcrFile = path.join(OUTPUT_OCR_DIR, 'PL_2019_19S.xlsx');

  await exportJsonToExcel(job, daCheckFile);
  fs.copyFileSync(daCheckFile, outputOcrFile);
  console.log(`Exported 19S to:\n  - ${daCheckFile}\n  - ${outputOcrFile}`);

  // Sync photo rows to Tl_loại_VP_Toàn_PL.xlsx
  console.log('Checking photo rows in 19S to sync to Tl_loại_VP_Toàn_PL.xlsx...');
  for (const r of activeRows) {
    if (r.loaiBan === 'Photo') {
      try {
        await appendTaiLieuLoai({
          type: 'photo',
          tenVanBan: `${r.tenLoaiTrichYeu}${r.soKyHieuVanBan ? ' (Số ' + r.soKyHieuVanBan + ')' : ''}`,
          soHoSo: 'PL_2019_19S',
          thbq: 'Vĩnh viễn'
        });
        console.log(`Synced Photo doc to Tl_loại: '${r.tenLoaiTrichYeu.slice(0, 40)}'`);
      } catch (err) {
        console.warn(`Sync warning: ${err.message}`);
      }
    }
  }
}

// ==========================================
// 2. PROCESS PL_2019_19T
// ==========================================
async function process19T() {
  console.log('\n>>> PROCESSING PL_2019_19T...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19T.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Hồ sơ Đạo đức công vụ năm 2019 xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19T';
  job.data.soKyHieuHoSo = 'PL_2019_19T';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2019';
  job.data.thoiGianHoSo = 'Từ ngày 05/01/2019 đến ngày 20/02/2019';
  job.data.thbq = 'Vĩnh viễn';

  // 19T has 5 photos:
  // 001.jpg is cover folder ("Hồ sơ Đạo đức công vụ năm 2019") -> SKIP!
  // 002.jpg: STT 1, 02/KH-UBND (05/01/2019), sheets 01-06
  // 003.jpg: STT 2, Biên bản kiểm tra (19/02/2019), sheets 07-17
  // 004.jpg + 005.jpg: STT 3, 09/QĐ-UBND (20/02/2019), sheets 18-23
  if (job.images) {
    job.images.forEach(img => {
      const fn = img.fileName || img.file_name || '';
      if (fn === '001.jpg') {
        img.status = 'skip';
        img.isExcluded = true;
        img.excludeReason = 'Bìa hồ sơ lưu trữ';
      } else {
        img.status = 'ok';
        img.isExcluded = false;
      }
    });
  }

  const activeRows = [
    {
      soTT: '1',
      soKyHieuVanBan: '02/KH-UBND',
      ngayThangVanBan: '05/01/2019',
      tenLoaiTrichYeu: 'Kế hoạch thực hiện năm “KỶ CƯƠNG HÀNH CHÍNH, ĐẠO ĐỨC CÔNG VỤ” trong thi hành nhiệm vụ của Cán Bộ, công chức xã Phú Lộc',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '01-06',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: ['002.jpg']
    },
    {
      soTT: '2',
      soKyHieuVanBan: '',
      ngayThangVanBan: '19/02/2019',
      tenLoaiTrichYeu: 'Biên bản kiểm tra việc chấp hành kỷ cương hành chính, đạo đức công vụ trong thi hành nhiệm vụ',
      tacGiaVanBan: 'Tổ kiểm tra công vụ xã Phú Lộc',
      toSoTrangSo: '07-17',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: ['003.jpg']
    },
    {
      soTT: '3',
      soKyHieuVanBan: '09/QĐ-UBND',
      ngayThangVanBan: '20/02/2019',
      tenLoaiTrichYeu: 'Quyết định về việc ban hành quy chế hoạt động việc chấp hành kỷ luật, kỷ cương hành chính, đạo đức công vụ, văn hóa giao tiếp của Cán Bộ, công chức xã Phú Lộc',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '18-23',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: ['004.jpg', '005.jpg']
    }
  ];

  job.data.rows = activeRows;
  job.data.rowsTrung = [];
  job.status = 'done';
  job.exportedFileName = 'PL_2019_19T.xlsx';

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Updated ${jobPath} with ${activeRows.length} active rows, sheets 01-23.`);

  const daCheckFile = path.join(DA_CHECK_DIR, 'PL_2019_19T.xlsx');
  const outputOcrFile = path.join(OUTPUT_OCR_DIR, 'PL_2019_19T.xlsx');

  await exportJsonToExcel(job, daCheckFile);
  fs.copyFileSync(daCheckFile, outputOcrFile);
  console.log(`Exported 19T to:\n  - ${daCheckFile}\n  - ${outputOcrFile}`);
}

async function main() {
  await process19S();
  await process19T();
  console.log('\n>>> BATCH 2019-9 PROCESSING COMPLETE!');
}

main().catch(console.error);
