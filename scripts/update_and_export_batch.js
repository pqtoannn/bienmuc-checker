import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// Helper to format sheet range string
function formatRange(start, end) {
  if (!start) return '';
  if (!end || start === end) return String(start);
  return `${start}-${end}`;
}

// ==========================================
// 1. PROCESS PL_2022_22O
// ==========================================
async function process22O() {
  console.log('\n>>> PROCESSING PL_2022_22O...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2022_22O.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const starts = [
    null, // 001 cover
    1, 3, 7, 10, 12, 19, 22, 25, 26, 29, 32, 33, 35, 39, 43, 46, 51, 60, 61, 64, 67, 68, 75, 77, 79, 80
  ];
  const maxSheet = 80;

  job.data.tenHoSo = 'Hồ sơ về đánh giá, chấm điểm công tác dân vận chính quyền năm 2022 của UBND xã Phú Lộc';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2022_22O';
  job.data.namGiaiDoan = '2022';
  job.data.thoiGianHoSo = 'Từ ngày 02/01/2022 đến ngày 29/11/2022';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      // 001.jpg cover
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else {
      img.isExcluded = false;
      img.status = 'active';

      const s = starts[idx];
      let e = maxSheet;
      for (let next = idx + 1; next < starts.length; next++) {
        if (starts[next] !== null && starts[next] !== undefined) {
          e = starts[next] - 1;
          break;
        }
      }
      row.toSoTrangSo = (s === e) ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')}-${String(e).padStart(2, '0')}`;
    }
  });

  // Specific fixes for 22O
  // Row 2 (002):
  job.data.rows[1].loaiBan = 'Bản gốc';
  job.data.rows[1].tacGiaVanBan = 'Ban Thường trực Ủy ban MTTQ Việt Nam xã Phú Lộc';

  // Row 11 (011):
  job.data.rows[10].soKyHieuVanBan = '01-QC/KDV-UBND';
  job.data.rows[10].ngayThangVanBan = '28/02/2022';
  job.data.rows[10].tacGiaVanBan = 'Khối Dân vận xã - UBND xã Phú Lộc';

  // Row 13 (013):
  job.data.rows[12].tacGiaVanBan = 'CĐCS xã Phú Lộc - BVĐ Chương trình III';

  // Row 14 (014):
  job.data.rows[13].soKyHieuVanBan = '45/KH-UBND';
  job.data.rows[13].ngayThangVanBan = '15/04/2022';

  // Row 15 (015):
  job.data.rows[14].soKyHieuVanBan = '42/BC-UBND';
  job.data.rows[14].ngayThangVanBan = '22/04/2022';

  // Row 16 (016):
  job.data.rows[15].soKyHieuVanBan = '102-BC/ĐU';
  job.data.rows[15].tacGiaVanBan = 'Đảng ủy xã Phú Lộc';

  // Row 17 (017):
  job.data.rows[16].tacGiaVanBan = 'UBND xã Phú Lộc - BCĐ PTTDĐKXDĐSVH';

  // Row 21 (021):
  job.data.rows[20].soKyHieuVanBan = '170/BC-UBND';

  // Row 22 (022):
  job.data.rows[21].soKyHieuVanBan = '171/BC-UBND';

  // Row 23 (023):
  job.data.rows[22].soKyHieuVanBan = '178/BC-UBND';

  // Row 24 (024):
  job.data.rows[23].soKyHieuVanBan = '09/KH-UBND';

  // Row 25 (025):
  job.data.rows[24].soKyHieuVanBan = '183/BC-UBND';
  job.data.rows[24].ngayThangVanBan = '11/11/2022';

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.name === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 80 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2022_22O.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2022_22O.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2022_22O.xlsx'));
  console.log('Exported 22O Da_check:', res1);
  console.log('Exported 22O PL_outputOCR:', res2);
}

// ==========================================
// 2. PROCESS PL_2022_22M
// ==========================================
async function process22M() {
  console.log('\n>>> PROCESSING PL_2022_22M...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2022_22M.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // Exact starting sheet for each photo 001 to 108
  // 001 is cover
  const starts = [
    null, // 001
    1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 38,
    39, 40, 41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72,
    73, 74, 75, 77, 79, 80, 81, 82, 83, 84, 85, 87, 91, 93, 94, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 113, 114, 116,
    117, 118, 120, 121, 122, 123, 124, 125, 126, 127, '129a', '129b'
  ];

  job.data.tenHoSo = 'Hồ sơ thông báo đi của UBND xã Phú Lộc năm 2022';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2022_22M';
  job.data.namGiaiDoan = '2022';
  job.data.thoiGianHoSo = 'Từ ngày 05/01/2022 đến ngày 28/12/2022';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      // 001.jpg cover
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else if (idx === 107) {
      // 108.jpg is attached table of 107.jpg
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else if (idx === 106) {
      // 107.jpg is 79/TB-PCTT spanning 129a-129b
      img.isExcluded = false;
      img.status = 'active';
      row.toSoTrangSo = '129a-129b';
    } else {
      img.isExcluded = false;
      img.status = 'active';

      const s = starts[idx];
      let e = null;
      for (let next = idx + 1; next < starts.length - 1; next++) {
        if (typeof starts[next] === 'number') {
          e = starts[next] - 1;
          break;
        } else if (starts[next] === '129a') {
          e = 128;
          break;
        }
      }
      if (s === e) {
        row.toSoTrangSo = String(s).padStart(2, '0');
      } else {
        row.toSoTrangSo = `${String(s).padStart(2, '0')}-${String(e).padStart(2, '0')}`;
      }
    }
  });

  // Specific fixes for 22M
  // Row 8 (008):
  job.data.rows[7].soKyHieuVanBan = '07/TB-UBND';

  // Row 107 (107):
  job.data.rows[106].tacGiaVanBan = 'UBND xã Phú Lộc - Ban CHPCLB&TKCN';

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.name === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 129 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2022_22M.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2022_22M.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2022_22M.xlsx'));
  console.log('Exported 22M Da_check:', res1);
  console.log('Exported 22M PL_outputOCR:', res2);
}

// ==========================================
// 3. PROCESS PL_2022_22K
// ==========================================
async function process22K() {
  console.log('\n>>> PROCESSING PL_2022_22K...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2022_22K.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // Starts for 22K (001 to 097)
  const starts = [
    null, // 001
    1, 2, 3, 6, 8, 11, 15, 18, 21, 24, 26, 29, 31, 34, 35, 37, 39, 41, 43, 48, 51, 54, 59, 60, 63, 66, 68, 70, 72, 75, 79,
    81, 83, 86, 89, 91, 93, 96, 98, 101, 103, 105, 115, 116, 119, 120, 123, 129, 131, 134, 136, 139, 141, 144, 148, 149, 151, 155, 158, 159, 162, 164, 167,
    169, 171, 175, 177, 179, 183, 185, 188, 194, 196, 199, 201, 202, 204, 207, 209, 212, 214, 217, 219, 220, 224, 226, 228, 229, 230, 232, 236, 239, 242, 244, 247, 248
  ];

  job.data.tenHoSo = 'Hồ sơ kế hoạch đi của UBND xã Phú Lộc năm 2022';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2022_22K';
  job.data.namGiaiDoan = '2022';
  job.data.thoiGianHoSo = 'Từ ngày 08/01/2022 đến ngày 27/12/2022';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      // 001.jpg cover
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else if (idx === 96) {
      // 097.jpg is 2nd page of 99/KH-UBND (096.jpg)
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else if (idx === 95) {
      // 096.jpg is 99/KH-UBND spanning 247-248
      img.isExcluded = false;
      img.status = 'active';
      row.toSoTrangSo = '247-248';
    } else {
      img.isExcluded = false;
      img.status = 'active';

      const s = starts[idx];
      let e = 246;
      for (let next = idx + 1; next < starts.length - 1; next++) {
        if (typeof starts[next] === 'number') {
          e = starts[next] - 1;
          break;
        }
      }
      if (s === e) {
        row.toSoTrangSo = String(s).padStart(2, '0');
      } else {
        row.toSoTrangSo = `${String(s).padStart(2, '0')}-${String(e).padStart(2, '0')}`;
      }
    }
  });

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.name === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 248 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2022_22K.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2022_22K.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2022_22K.xlsx'));
  console.log('Exported 22K Da_check:', res1);
  console.log('Exported 22K PL_outputOCR:', res2);
}

async function main() {
  await process22O();
  await process22M();
  await process22K();
  console.log('\n=============================================');
  console.log('BATCH 3 DOSSIERS COMPLETED SUCCESSFULLY!');
  console.log('=============================================');
}

main().catch(err => {
  console.error('Fatal batch export error:', err);
  process.exit(1);
});
