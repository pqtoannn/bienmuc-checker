import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// ==========================================
// 1. PROCESS PL_2022_22I
// ==========================================
async function process22I() {
  console.log('\n>>> PROCESSING PL_2022_22I...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2022_22I.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const starts = [
    null, // 001 cover
    1, 5, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 25, 28, 30, 39, 43, 44, 52, 57, 59, 63, 64, 65, 67,
    70, 71, 72, 73, 77, 78, 83, 84, 86, 88, 92, 93, 97, 100, 102, 103,
    104, 105, 106, 109, 111, 112, 117, 118, 122, 123, 126, 128, 132, 137, 138, 139,
    140, 141, 144, 147, 157, 158, 160, 161, 163, 164, 165, 166, 168, 169, 170, 176,
    178, 181, 183, 186, 187, 189, 190, 191, 192, 193, 194, 196, 199, 200, 203, 208,
    209, 210, 211, 212, 213, 216
  ];
  const maxSheet = 216;

  job.data.tenHoSo = 'Hồ sơ báo cáo đi (quý I và II) của UBND xã Phú Lộc năm 2022';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2022_22I';
  job.data.namGiaiDoan = '2022';
  job.data.thoiGianHoSo = 'Từ ngày 08/01/2022 đến ngày 30/06/2022';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else {
      img.isExcluded = false;
      img.status = 'active';

      const s = starts[idx];
      let e = maxSheet;
      for (let next = idx + 1; next < starts.length; next++) {
        if (typeof starts[next] === 'number') {
          e = starts[next] - 1;
          break;
        }
      }
      row.toSoTrangSo = (s === e) ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')}-${String(e).padStart(2, '0')}`;
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

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 216 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2022_22I.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2022_22I.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2022_22I.xlsx'));
  console.log('Exported 22I Da_check:', res1);
  console.log('Exported 22I PL_outputOCR:', res2);
}

// ==========================================
// 2. PROCESS PL_2022_22F
// ==========================================
async function process22F() {
  console.log('\n>>> PROCESSING PL_2022_22F...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2022_22F.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const starts = [
    null, // 001 cover
    101, 102, 105, 106, 114, 115, 117, 119, 120, 123, 124, 125, 127, 128, 129,
    131, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 145, 147, 148, 149,
    152, 153, 154, 155, 157, 159, 160, 161, 162, 163, 164, 165, 167, 168, 170, 171,
    172, 173, 175, 178, 182, 184, 186, 188, 190, 191, 192, 195, 196, 197, 198, 199,
    200, 201, 203, 204, 205, 207, 209, 210, 213, 215, 217, 218, 219, 220, 221, 222,
    223, 224
  ];
  const maxSheet = 224;

  job.data.tenHoSo = 'Hồ sơ tờ trình đi (quý III và IV) của UBND xã Phú Lộc năm 2022';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2022_22F';
  job.data.namGiaiDoan = '2022';
  job.data.thoiGianHoSo = 'Từ ngày 04/07/2022 đến ngày 20/12/2022';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else {
      img.isExcluded = false;
      img.status = 'active';

      const s = starts[idx];
      let e = maxSheet;
      for (let next = idx + 1; next < starts.length; next++) {
        if (typeof starts[next] === 'number') {
          e = starts[next] - 1;
          break;
        }
      }
      row.toSoTrangSo = (s === e) ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')}-${String(e).padStart(2, '0')}`;
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

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 124 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2022_22F.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2022_22F.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2022_22F.xlsx'));
  console.log('Exported 22F Da_check:', res1);
  console.log('Exported 22F PL_outputOCR:', res2);
}

// ==========================================
// 3. PROCESS PL_2022_22E
// ==========================================
async function process22E() {
  console.log('\n>>> PROCESSING PL_2022_22E...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2022_22E.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  const starts = [
    null, // 001 cover outer
    null, // 002 cover note
    1, 22, 26, 28, 29, 30, 31, 33, 35, 37, 39, 41, 43, 45,
    47, 49, 51, 53, 60, 62, 63, 64, 67, 68, 69, 70, 72, 74, 78, 79,
    80, 85, 87, 89, 94, 96, 98, 99, 102, 105, 106, 107, 109, 110, 111, 112,
    113, 114, 116, 119, 122, 125, 128, 131, 134, 136, 138, 140, 142, 145, 148, 154,
    157, 158, 160, 161, 162, 163, 164, 165, 166, 167, 168, 170, 171, 172, 173, 174,
    175, 176, 177, 178, 179, 180, 181, 182, 183, 185, 187, 189, 190, 191, 193
  ];
  const maxSheet = 193;

  job.data.tenHoSo = 'Hồ sơ tờ trình đi (quý I và II) của UBND xã Phú Lộc năm 2022';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2022_22E';
  job.data.namGiaiDoan = '2022';
  job.data.thoiGianHoSo = 'Từ ngày 05/01/2022 đến ngày 30/06/2022';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0 || idx === 1) {
      // 001.jpg outer cover, 002.jpg cover note placed on page 1
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else {
      img.isExcluded = false;
      img.status = 'active';

      const s = starts[idx];
      let e = maxSheet;
      for (let next = idx + 1; next < starts.length; next++) {
        if (typeof starts[next] === 'number') {
          e = starts[next] - 1;
          break;
        }
      }
      row.toSoTrangSo = (s === e) ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')}-${String(e).padStart(2, '0')}`;
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

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, 193 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2022_22E.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2022_22E.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2022_22E.xlsx'));
  console.log('Exported 22E Da_check:', res1);
  console.log('Exported 22E PL_outputOCR:', res2);
}

async function main() {
  await process22I();
  await process22F();
  await process22E();
  console.log('\n=============================================');
  console.log('BATCH 2 (22I, 22F, 22E) COMPLETED SUCCESSFULLY!');
  console.log('=============================================');
}

main().catch(err => {
  console.error('Fatal batch 2 export error:', err);
  process.exit(1);
});
