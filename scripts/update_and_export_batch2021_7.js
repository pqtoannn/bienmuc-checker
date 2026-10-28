import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// Helper to assign continuous sheet ranges from page counts
function computeRangesFromPageCounts(multiPages, totalPhotos) {
  // photoNum goes from 2 to totalPhotos
  const ranges = {};
  let curSheet = 1;
  for (let p = 2; p <= totalPhotos; p++) {
    const pages = multiPages[p] || 1;
    const start = curSheet;
    const end = curSheet + pages - 1;
    ranges[p] = (start === end) ? String(start).padStart(2, '0') : `${String(start).padStart(2, '0')}-${String(end).padStart(2, '0')}`;
    curSheet += pages;
  }
  return { ranges, totalSheets: curSheet - 1 };
}

// ==========================================
// 1. PROCESS PL_2021_21o
// ==========================================
async function process21o() {
  console.log('\n>>> PROCESSING PL_2021_21o...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21o.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 208 photos: idx 0 is cover (001.jpg)
  // 207 active documents: idx 1 to 207 (002.jpg to 208.jpg)
  // Multi-page documents (+8 sheets):
  // photo 23: 3 sheets (22-24)
  // photo 50: 2 sheets (51-52)
  // photo 55: 2 sheets (57-58)
  // photo 59: 2 sheets (62-63)
  // photo 61: 4 sheets (65-68)
  const multiPages21o = {
    23: 3,
    50: 2,
    55: 2,
    59: 2,
    61: 4
  };

  const { ranges: ranges21o, totalSheets: totalSheets21o } = computeRangesFromPageCounts(multiPages21o, 208);
  console.log(`PL_2021_21o computed sheets: ${totalSheets21o}`);

  job.data.tenHoSo = 'Hồ sơ quyết định đi (tháng 7, tập 1) của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21o';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 01/07/2021 đến ngày 31/07/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.data.rowsTrung = [];

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else {
      const photoNum = idx + 1;
      img.isExcluded = false;
      img.status = 'active';
      row.toSoTrangSo = ranges21o[photoNum];
      row.loaiBan = 'Bản gốc';
      if (!row.tacGiaVanBan) {
        row.tacGiaVanBan = 'Ủy ban nhân dân xã Phú Lộc';
      }

      if (row.soKyHieuVanBan) {
        row.soKyHieuVanBan = row.soKyHieuVanBan.replace(/O/g, '0').trim();
      }
    }
  });

  // Targeted corrections for 21o
  // 014.jpg to 022.jpg (idx 13 to 21)
  if (job.data.rows[13]) job.data.rows[13].soKyHieuVanBan = '248/QĐ-XPVPHC'; // 014.jpg
  if (job.data.rows[14]) job.data.rows[14].soKyHieuVanBan = '250/QĐ-XPVPHC'; // 015.jpg
  if (job.data.rows[15]) job.data.rows[15].soKyHieuVanBan = '251/QĐ-XPVPHC'; // 016.jpg
  if (job.data.rows[16]) job.data.rows[16].soKyHieuVanBan = '252/QĐ-XPVPHC'; // 017.jpg
  if (job.data.rows[17]) job.data.rows[17].soKyHieuVanBan = '253/QĐ-XPVPHC'; // 018.jpg
  if (job.data.rows[18]) job.data.rows[18].soKyHieuVanBan = '254/QĐ-XPVPHC'; // 019.jpg
  if (job.data.rows[19]) job.data.rows[19].soKyHieuVanBan = '255/QĐ-XPVPHC'; // 020.jpg
  if (job.data.rows[20]) job.data.rows[20].soKyHieuVanBan = '256/QĐ-XPVPHC'; // 021.jpg
  if (job.data.rows[21]) {
    job.data.rows[21].soKyHieuVanBan = '257/QĐ-XPVPHC'; // 022.jpg
    job.data.rows[21].ngayThangVanBan = '06/07/2021';
  }

  // 028.jpg (idx 27)
  if (job.data.rows[27]) job.data.rows[27].soKyHieuVanBan = '263/QĐ-UBND';

  // 200.jpg to 208.jpg (idx 199 to 207)
  if (job.data.rows[199]) job.data.rows[199].soKyHieuVanBan = '441/QĐ-UBND'; // 200.jpg
  if (job.data.rows[201]) {
    job.data.rows[201].soKyHieuVanBan = '443/QĐ-UBND'; // 202.jpg
    job.data.rows[201].ngayThangVanBan = '31/07/2021';
  }
  if (job.data.rows[202]) {
    job.data.rows[202].soKyHieuVanBan = '444/QĐ-UBND'; // 203.jpg
    job.data.rows[202].ngayThangVanBan = '31/07/2021';
  }
  if (job.data.rows[203]) {
    job.data.rows[203].soKyHieuVanBan = '445/QĐ-UBND'; // 204.jpg
    job.data.rows[203].ngayThangVanBan = '31/07/2021';
  }
  if (job.data.rows[204]) {
    job.data.rows[204].soKyHieuVanBan = '446/QĐ-UBND'; // 205.jpg
    job.data.rows[204].ngayThangVanBan = '31/07/2021';
  }
  if (job.data.rows[205]) {
    job.data.rows[205].soKyHieuVanBan = '447/QĐ-UBND'; // 206.jpg
    job.data.rows[205].ngayThangVanBan = '31/07/2021';
  }
  if (job.data.rows[206]) {
    job.data.rows[206].soKyHieuVanBan = '448/QĐ-UBND'; // 207.jpg
    job.data.rows[206].ngayThangVanBan = '31/07/2021';
  }
  if (job.data.rows[207]) {
    job.data.rows[207].soKyHieuVanBan = '449/QĐ-UBND'; // 208.jpg
    job.data.rows[207].ngayThangVanBan = '31/07/2021';
  }

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.fileName === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, ${totalSheets21o} tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21o.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21o.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21o.xlsx'));
  console.log('Exported 21o Da_check:', res1);
  console.log('Exported 21o PL_outputOCR:', res2);
}

// ==========================================
// 2. PROCESS PL_2021_21p
// ==========================================
async function process21p() {
  console.log('\n>>> PROCESSING PL_2021_21p...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21p.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 200 photos:
  // idx 0 is cover (001.jpg) -> exclude
  // idx 1 to 196 (002.jpg to 197.jpg) -> 196 active documents
  // idx 197 (198.jpg) -> Photo copy (exclude, sync to Tl_loai)
  // idx 198, 199 (199.jpg, 200.jpg) -> Trung copy (exclude, sync to Tl_loai)
  // Multi-page documents (+28 sheets):
  const multiPages21p = {
    17: 2,   // 017.jpg: 16-17
    30: 2,   // 030.jpg: 30-31
    33: 2,   // 033.jpg: 34-35
    53: 2,   // 053.jpg: 55-56
    56: 2,   // 056.jpg: 59-60
    59: 3,   // 059.jpg: 63-65
    60: 2,   // 060.jpg: 66-67
    87: 6,   // 087.jpg: 94-99
    110: 7,  // 110.jpg: 122-128
    112: 2,  // 112.jpg: 130-131
    113: 2,  // 113.jpg: 132-133
    114: 2,  // 114.jpg: 134-135
    115: 2,  // 115.jpg: 136-137
    116: 2,  // 116.jpg: 138-139
    118: 2,  // 118.jpg: 141-142
    126: 3,  // 126.jpg: 150-152
    127: 2   // 127.jpg: 153-154
  };

  const { ranges: ranges21p, totalSheets: totalSheets21p } = computeRangesFromPageCounts(multiPages21p, 197);
  console.log(`PL_2021_21p computed sheets: ${totalSheets21p}`);

  job.data.tenHoSo = 'Hồ sơ quyết định đi (tháng 8 - tháng 9, tập 2) của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21p';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 02/08/2021 đến ngày 30/09/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';

  job.data.rowsTrung = [];

  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0 || idx >= 197) {
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else {
      const photoNum = idx + 1;
      img.isExcluded = false;
      img.status = 'active';
      row.toSoTrangSo = ranges21p[photoNum];
      row.loaiBan = 'Bản gốc';
      if (!row.tacGiaVanBan) {
        row.tacGiaVanBan = 'Ủy ban nhân dân xã Phú Lộc';
      }

      if (row.soKyHieuVanBan) {
        row.soKyHieuVanBan = row.soKyHieuVanBan.replace(/O/g, '0').trim();
      }
    }
  });

  // Targeted corrections for 21p
  // Rows 32 to 37 (033.jpg to 038.jpg)
  if (job.data.rows[32]) {
    job.data.rows[32].soKyHieuVanBan = '481/QĐ-UBND'; // 033.jpg
    job.data.rows[32].ngayThangVanBan = '09/08/2021';
  }
  if (job.data.rows[34]) {
    job.data.rows[34].soKyHieuVanBan = '483/QĐ-UBND'; // 035.jpg
    job.data.rows[34].ngayThangVanBan = '09/08/2021';
  }
  if (job.data.rows[35]) {
    job.data.rows[35].soKyHieuVanBan = '484/QĐ-UBND'; // 036.jpg
    job.data.rows[35].ngayThangVanBan = '09/08/2021';
  }
  if (job.data.rows[36]) {
    job.data.rows[36].soKyHieuVanBan = '485/QĐ-UBND'; // 037.jpg
    job.data.rows[36].ngayThangVanBan = '09/08/2021';
  }
  if (job.data.rows[37]) {
    job.data.rows[37].soKyHieuVanBan = '486/QĐ-UBND'; // 038.jpg
    job.data.rows[37].ngayThangVanBan = '10/08/2021';
  }

  // Row 86 (087.jpg)
  if (job.data.rows[86]) {
    job.data.rows[86].soKyHieuVanBan = '630/QĐ-BCH';
    job.data.rows[86].tacGiaVanBan = 'Ban Chỉ huy Phòng thủ dân sự xã Phú Lộc';
  }

  // Row 139 (140.jpg)
  if (job.data.rows[139]) {
    job.data.rows[139].soKyHieuVanBan = '684/QĐ-XPVPHC';
    job.data.rows[139].ngayThangVanBan = '14/09/2021';
  }

  // Rows 153 to 156 (154.jpg to 157.jpg)
  if (job.data.rows[153]) {
    job.data.rows[153].soKyHieuVanBan = '698/QĐ-XPVPHC'; // 154.jpg
  }
  if (job.data.rows[154]) {
    job.data.rows[154].soKyHieuVanBan = '699/QĐ-UBND'; // 155.jpg
    job.data.rows[154].ngayThangVanBan = '20/09/2021';
  }
  if (job.data.rows[155]) {
    job.data.rows[155].soKyHieuVanBan = '700/QĐ-UBND'; // 156.jpg
    job.data.rows[155].ngayThangVanBan = '20/09/2021';
  }
  if (job.data.rows[156]) {
    job.data.rows[156].soKyHieuVanBan = '701/QĐ-UBND'; // 157.jpg
    job.data.rows[156].ngayThangVanBan = '20/09/2021';
  }

  // Rows 159 to 163 (160.jpg to 164.jpg)
  if (job.data.rows[159]) {
    job.data.rows[159].soKyHieuVanBan = '704/QĐ-UBND'; // 160.jpg
    job.data.rows[159].ngayThangVanBan = '20/09/2021';
  }
  if (job.data.rows[160]) {
    job.data.rows[160].soKyHieuVanBan = '705/QĐ-UBND'; // 161.jpg
    job.data.rows[160].ngayThangVanBan = '20/09/2021';
  }
  if (job.data.rows[161]) {
    job.data.rows[161].soKyHieuVanBan = '706/QĐ-UBND'; // 162.jpg
    job.data.rows[161].ngayThangVanBan = '21/09/2021';
  }
  if (job.data.rows[163]) {
    job.data.rows[163].soKyHieuVanBan = '708/QĐ-UBND'; // 164.jpg
    job.data.rows[163].ngayThangVanBan = '21/09/2021';
  }

  // Row 167 (168.jpg)
  if (job.data.rows[167]) {
    job.data.rows[167].soKyHieuVanBan = '711/QĐ-UBND'; // 168.jpg
    job.data.rows[167].ngayThangVanBan = '22/09/2021';
  }

  // Row 178 (179.jpg)
  if (job.data.rows[178]) {
    job.data.rows[178].soKyHieuVanBan = '723/QĐ-UBND'; // 179.jpg
    job.data.rows[178].ngayThangVanBan = '25/09/2021';
  }

  // Rows 184, 185 (185.jpg, 186.jpg)
  if (job.data.rows[184]) {
    job.data.rows[184].soKyHieuVanBan = '729/QĐ-UBND'; // 185.jpg
    job.data.rows[184].ngayThangVanBan = '29/09/2021';
  }
  if (job.data.rows[185]) {
    job.data.rows[185].soKyHieuVanBan = '730/QĐ-UBND'; // 186.jpg
    job.data.rows[185].ngayThangVanBan = '29/09/2021';
  }

  // Row 189 (190.jpg)
  if (job.data.rows[189]) {
    job.data.rows[189].soKyHieuVanBan = '734/QĐ-UBND'; // 190.jpg
    job.data.rows[189].ngayThangVanBan = '30/09/2021';
  }

  // Rows 192, 193, 194 (193.jpg, 194.jpg, 195.jpg)
  if (job.data.rows[192]) {
    job.data.rows[192].soKyHieuVanBan = '737/QĐ-UBND'; // 193.jpg
    job.data.rows[192].ngayThangVanBan = '30/09/2021';
  }
  if (job.data.rows[193]) {
    job.data.rows[193].soKyHieuVanBan = '738/QĐ-UBND'; // 194.jpg
    job.data.rows[193].ngayThangVanBan = '30/09/2021';
  }
  if (job.data.rows[194]) {
    job.data.rows[194].soKyHieuVanBan = '739/QĐ-UBND'; // 195.jpg
    job.data.rows[194].ngayThangVanBan = '30/09/2021';
  }

  // Re-number active soTT
  let activeStt = 1;
  job.data.rows.forEach(r => {
    const parentImg = job.images.find(img => img.fileName === r.sourceFileNames?.[0]);
    if (!parentImg?.isExcluded) {
      r.soTT = String(activeStt++);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeStt - 1} văn bản, ${totalSheets21p} tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21p.job.json');

  const exportData = {
    ...job.data,
    rows: job.data.rows.filter((r, idx) => !job.images[idx]?.isExcluded)
  };

  const res1 = await exportJsonToExcel(exportData, path.join(DA_CHECK_DIR, 'PL_2021_21p.xlsx'));
  const res2 = await exportJsonToExcel(exportData, path.join(OUTPUT_OCR_DIR, 'PL_2021_21p.xlsx'));
  console.log('Exported 21p Da_check:', res1);
  console.log('Exported 21p PL_outputOCR:', res2);

  // Sync photo document (198.jpg) to Tl_loại_VP_Toàn_PL.xlsx sheet Photo
  console.log('Checking photo document of 21p in Tl_loại_VP_Toàn_PL.xlsx...');
  const ExcelJS = (await import('exceljs')).default;
  const wbTl = new ExcelJS.Workbook();
  const tlPath = path.join(DA_CHECK_DIR, 'Tl_loại_VP_Toàn_PL.xlsx');
  await wbTl.xlsx.readFile(tlPath);

  const wsPhoto = wbTl.getWorksheet('Photo');
  let hasPhoto = false;
  wsPhoto.eachRow((r) => {
    const val = (r.getCell(3).value || '').toString();
    if (val.includes('552/QĐ-UBND') || (val.includes('Võ Thị Vang') && val.includes('PL_2021_21p'))) {
      hasPhoto = true;
    }
  });

  if (!hasPhoto) {
    await appendTaiLieuLoai({
      type: 'photo',
      tenVanBan: 'Quyết định số 552/QĐ-UBND ngày 26/08/2021 của UBND xã Phú Lộc về việc điều động công tác đối với người hoạt động không chuyên trách xã, bà Võ Thị Vang',
      soHoSo: 'PL_2021_21p',
      thbq: 'Vĩnh viễn'
    });
    console.log('Appended photo document (552/QĐ-UBND) to Tl_loại_VP_Toàn_PL.xlsx sheet Photo');
  } else {
    console.log('Photo document (552/QĐ-UBND) already present in Tl_loại_VP_Toàn_PL.xlsx sheet Photo');
  }

  // Sync duplicate document (199.jpg-200.jpg) to Tl_loại_VP_Toàn_PL.xlsx sheet Trùng
  console.log('Checking duplicate document of 21p in Tl_loại_VP_Toàn_PL.xlsx...');
  const wsTrung = wbTl.getWorksheet('Trùng');
  let hasTrung = false;
  wsTrung.eachRow((r) => {
    const val = (r.getCell(3).value || '').toString();
    if (val.includes('484/QĐ-UBND') && val.includes('Đường Ông Ba Lộc')) {
      hasTrung = true;
    }
  });

  if (!hasTrung) {
    await appendTaiLieuLoai({
      type: 'trung',
      tenVanBan: 'Quyết định số 484/QĐ-UBND ngày 09/08/2021 của UBND xã Phú Lộc về việc phê duyệt dự toán chi phí chuẩn bị đầu tư công trình: Đường Ông Ba Lộc Đến Ông Đặng Nam Ấp 2',
      soHoSo: 'PL_2021_21p',
      lyDoTrung: 'Trùng hs PL_2021_21p',
      thbq: 'Vĩnh viễn'
    });
    console.log('Appended duplicate document (484/QĐ-UBND) to Tl_loại_VP_Toàn_PL.xlsx sheet Trùng');
  } else {
    console.log('Duplicate document (484/QĐ-UBND) already present in Tl_loại_VP_Toàn_PL.xlsx sheet Trùng');
  }
}

async function main() {
  await process21o();
  await process21p();
  console.log('\n>>> COMPLETED BATCH 7 (2021)!');
}

main().catch(err => {
  console.error('Batch 7 processing failed:', err);
  process.exit(1);
});
