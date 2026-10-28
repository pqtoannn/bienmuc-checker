import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const pad = (n) => String(n).padStart(2, '0');

// ==========================================
// 1. PROCESS PL_2019_19Q
// ==========================================
async function process19Q() {
  console.log('\n>>> PROCESSING PL_2019_19Q...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19Q.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Biểu thống kê năm 2018 - 2019 xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19Q';
  job.data.soKyHieuHoSo = 'PL_2019_19Q';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2018 - 2019';
  job.data.thoiGianHoSo = 'Từ ngày 10/03/2018 đến ngày 02/05/2019';
  job.data.thbq = 'Vĩnh viễn';

  // 19Q has 5 photos, all active:
  // 001.jpg: 01-03
  // 002.jpg: 04
  // 003.jpg: 05-11
  // 004.jpg: 12-18
  // 005.jpg: 19
  const ranges19Q = [
    { start: 1, end: 3 },
    { start: 4, end: 4 },
    { start: 5, end: 11 },
    { start: 12, end: 18 },
    { start: 19, end: 19 }
  ];

  const activeRows = [];
  for (let i = 0; i < 5; i++) {
    const fn = `${String(i + 1).padStart(3, '0')}.jpg`;
    const origRow = (job.data.rows && job.data.rows[i]) ? job.data.rows[i] : {};
    const rng = ranges19Q[i];
    const toSoStr = rng.start === rng.end ? pad(rng.start) : `${pad(rng.start)}-${pad(rng.end)}`;

    const row = {
      soTT: String(i + 1),
      soKyHieuVanBan: origRow.soKyHieuVanBan || '',
      ngayThangVanBan: origRow.ngayThangVanBan || '',
      tenLoaiTrichYeu: origRow.tenLoaiTrichYeu || '',
      tacGiaVanBan: origRow.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: toSoStr,
      loaiBan: origRow.loaiBan || 'Bản gốc',
      ghiChu: '',
      banGocChinh: origRow.loaiBan || 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: [fn]
    };

    activeRows.push(row);
  }

  job.data.rows = activeRows;
  job.data.rowsTrung = [];
  job.status = 'done';
  job.exportedFileName = 'PL_2019_19Q.xlsx';

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Updated ${jobPath} with ${activeRows.length} active rows, sheets 01-19.`);

  const daCheckFile = path.join(DA_CHECK_DIR, 'PL_2019_19Q.xlsx');
  const outputOcrFile = path.join(OUTPUT_OCR_DIR, 'PL_2019_19Q.xlsx');

  await exportJsonToExcel(job, daCheckFile);
  fs.copyFileSync(daCheckFile, outputOcrFile);
  console.log(`Exported 19Q to:\n  - ${daCheckFile}\n  - ${outputOcrFile}`);
}

// ==========================================
// 2. PROCESS PL_2019_19R
// ==========================================
async function process19R() {
  console.log('\n>>> PROCESSING PL_2019_19R...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2019_19R.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  const dossierTitle = 'Danh sách các loại năm 2019 xã Phú Lộc';
  job.duAnTen = 'Tân Phú';
  job.soHoSo = 'PL_2019_19R';
  job.data.soKyHieuHoSo = 'PL_2019_19R';
  job.data.tieuDeNghiQuyet = dossierTitle;
  job.data.tenHoSo = dossierTitle;
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.namGiaiDoan = '2019';
  job.data.thoiGianHoSo = 'Từ ngày 05/01/2019 đến ngày 04/12/2019';
  job.data.thbq = 'Vĩnh viễn';

  // 19R has 34 photos:
  // 001.jpg is cover scrap note ("Công Văn Đi 2019 Xã Phú Lộc Danh Sách PL_2019_19R") -> SKIP!
  // Photos 002.jpg to 034.jpg are 33 active administrative documents.
  const starts19R = {
    2: 1,   // 01-02
    3: 3,   // 03
    4: 4,   // 04-05
    5: 6,   // 06
    6: 7,   // 07
    7: 8,   // 08
    8: 9,   // 09
    9: 10,  // 10
    10: 11, // 11
    11: 12, // 12-13
    12: 14, // 14-16
    13: 17, // 17-18
    14: 19, // 19-20
    15: 21, // 21
    16: 22, // 22
    17: 23, // 23
    18: 24, // 24-25
    19: 26, // 26-28
    20: 29, // 29-30
    21: 31, // 31-32
    22: 33, // 33-36
    23: 37, // 37-38
    24: 39, // 39
    25: 40, // 40-41
    26: 42, // 42-43
    27: 44, // 44-45
    28: 46, // 46-47
    29: 48, // 48-49
    30: 50, // 50
    31: 51, // 51-52
    32: 53, // 53
    33: 54, // 54
    34: 55  // 55
  };

  const ends19R = {};
  for (let i = 2; i <= 34; i++) {
    if (i === 34) {
      ends19R[i] = 55;
    } else {
      ends19R[i] = starts19R[i + 1] - 1;
    }
  }

  // Update images list: photo 001 skipped
  if (job.images) {
    job.images.forEach(img => {
      const fn = img.fileName || img.file_name || '';
      if (fn === '001.jpg') {
        img.status = 'skip';
        img.isExcluded = true;
        img.excludeReason = 'Bìa mảnh giấy ghi tên hồ sơ';
      } else {
        img.status = 'ok';
        img.isExcluded = false;
      }
    });
  }

  const activeRows = [];
  let sttCounter = 1;

  for (let photoNum = 2; photoNum <= 34; photoNum++) {
    const fn = `${String(photoNum).padStart(3, '0')}.jpg`;
    // Find original row matching this photo (index was photoNum - 1)
    const origRow = (job.data.rows && job.data.rows[photoNum - 1]) ? job.data.rows[photoNum - 1] : {};

    const startSheet = starts19R[photoNum];
    const endSheet = ends19R[photoNum];
    const toSoStr = startSheet === endSheet ? pad(startSheet) : `${pad(startSheet)}-${pad(endSheet)}`;

    let trichYeu = origRow.tenLoaiTrichYeu || '';
    let tacGia = origRow.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc';
    let soKyHieu = origRow.soKyHieuVanBan || '';
    let ngayThang = origRow.ngayThangVanBan || '';

    // Fix specific known corrections
    if (photoNum === 34) {
      tacGia = 'Phòng Kinh tế và Hạ tầng huyện Tân Phú';
      trichYeu = 'Thông báo về việc mời tham dự khóa tập huấn an toàn, ứng phó sự cố hóa chất, môi trường; an toàn điện tại các cơ sở kinh doanh khí dầu mỏ hóa lỏng, cơ sở sản xuất kinh doanh vật liệu nổ công nghiệp, tiền chất thuốc nổ và mạng lưới kinh doanh bán lẻ sản phẩm thuốc lá năm 2019';
      ngayThang = '04/12/2019';
    }

    const row = {
      soTT: String(sttCounter++),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: ngayThang,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: toSoStr,
      loaiBan: origRow.loaiBan || 'Bản gốc',
      ghiChu: '',
      banGocChinh: origRow.loaiBan || 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: [fn]
    };

    activeRows.push(row);
  }

  job.data.rows = activeRows;
  job.data.rowsTrung = [];
  job.status = 'done';
  job.exportedFileName = 'PL_2019_19R.xlsx';

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Updated ${jobPath} with ${activeRows.length} active rows, sheets 01-55.`);

  const daCheckFile = path.join(DA_CHECK_DIR, 'PL_2019_19R.xlsx');
  const outputOcrFile = path.join(OUTPUT_OCR_DIR, 'PL_2019_19R.xlsx');

  await exportJsonToExcel(job, daCheckFile);
  fs.copyFileSync(daCheckFile, outputOcrFile);
  console.log(`Exported 19R to:\n  - ${daCheckFile}\n  - ${outputOcrFile}`);
}

async function main() {
  await process19Q();
  await process19R();
  console.log('\n>>> BATCH 2019-8 PROCESSING COMPLETE!');
}

main().catch(console.error);
