import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
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
  // 1. PL_2015_15D (141 active rows, sheets 01-296)
  // =========================================================================
  console.log('Loading raw PL_2015_15D.xlsx...');
  const wb15D = xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15D.xlsx'));
  const rawRows15D = xlsx.utils.sheet_to_json(wb15D.Sheets[wb15D.SheetNames[0]], { header: 1 });

  const active15D = [];
  for (let r = 5; r <= 150; r++) {
    const row = rawRows15D[r];
    const stt = parseInt(row[0], 10);
    if (stt === 1 || stt === 52 || stt === 92 || stt === 101 || stt === 146) continue;
    active15D.push({
      stt,
      p: String(stt).padStart(3, '0') + '.jpg',
      so: (row[1] || '').toString().trim(),
      d: (row[2] || '').toString().trim(),
      ty: (row[3] || '').toString().trim(),
      tg: (row[4] || 'Ủy ban nhân dân xã Phú Lộc').toString().trim(),
      loaiBan: (row[6] || 'Bản gốc').toString().trim()
    });
  }

  const starts15D = [
    1, 2, 3, 4, 10, 11, 12, 14, 16, 17, 18, 19, 20, 30, 31, 32, 33, 34, 37, 39,
    40, 41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 59, 65, 67, 68,
    72, 74, 75, 76, 85, 86, 87, 88, 90, 91, 92, 96, 100, 101, 102, 103, 104, 105, 112, 113,
    114, 115, 117, 121, 122, 123, 129, 132, 133, 134, 135, 136, 137, 138, 141, 144, 145, 148, 149, 152,
    153, 155, 156, 157, 158, 159, 160, 161, 163, 164, 165, 166, 167, 169, 170, 171, 172, 175, 177, 179,
    181, 189, 190, 200, 201, 211, 213, 215, 216, 223, 224, 225, 234, 235, 236, 237, 238, 239, 240, 241,
    242, 248, 258, 261, 262, 263, 264, 265, 272, 275, 278, 280, 284, 285, 286, 289, 290, 291, 292, 294,
    296, 297
  ];

  const rowsConfig15D = [];
  for (let i = 0; i < active15D.length; i++) {
    const item = active15D[i];
    const s = starts15D[i];
    const e = starts15D[i + 1] - 1;
    rowsConfig15D.push({
      p: item.p,
      so: item.so,
      d: item.d,
      ty: item.ty,
      tg: item.tg,
      toSo: formatRange(s, e),
      loaiBan: item.loaiBan
    });
  }

  await processDossier({
    dosId: 'PL_2015_15D',
    title: 'HỒ SƠ TỜ TRÌNH',
    year: '2015',
    skipFiles: ['001.jpg', '052.jpg', '092.jpg', '101.jpg', '146.jpg'],
    rowsConfig: rowsConfig15D
  });

  // Sync duplicates of 15D
  console.log('Syncing duplicates of PL_2015_15D...');
  await appendTaiLieuLoai({
    type: 'trung',
    tenVanBan: 'Tờ trình số 52./TTr-UBND ngày 15/07/2015 về việc đề nghị khen thưởng phong trào thi đua Toàn xã chung sức xây dựng nông thôn mới (bản trùng scan 052)',
    soHoSo: 'PL_2015_15D',
    lyDoTrung: 'Trùng hs PL_2015_15D'
  });
  await appendTaiLieuLoai({
    type: 'trung',
    tenVanBan: 'Tờ trình số 89/TTr-UBND ngày 12/10/2015 về việc thẩm định báo cáo kinh tế kỹ thuật xây dựng Đường ông Tư Điệp (bản trùng scan 092)',
    soHoSo: 'PL_2015_15D',
    lyDoTrung: 'Trùng hs PL_2015_15D'
  });
  await appendTaiLieuLoai({
    type: 'trung',
    tenVanBan: 'Tờ trình số 98/TTr-UBND ngày 30/10/2015 về việc hộ nghèo tham gia dự án nhân rộng mô hình giảm nghèo năm 2015 (bản trùng scan 101)',
    soHoSo: 'PL_2015_15D',
    lyDoTrung: 'Trùng hs PL_2015_15D'
  });

  // Sync photo document of 15D
  console.log('Syncing photo scan 146 of PL_2015_15D...');
  await appendTaiLieuLoai({
    type: 'photo',
    tenVanBan: 'Tờ trình số 38/TTr-UBND ngày 22/06/2015 về việc phê duyệt kế hoạch đấu thầu. Công trình: Đường Hàng Chanh đoạn 2 xã Phú Lộc. Địa điểm: Xã Phú Lộc, huyện Tân Phú, tỉnh Đồng Nai (hs PL_2015_15D)',
    soHoSo: 'PL_2015_15D'
  });

  // =========================================================================
  // 2. PL_2015_15F (144 active rows, sheets 01-258)
  // =========================================================================
  console.log('\nLoading raw PL_2015_15F.xlsx...');
  const wb15F = xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15F.xlsx'));
  const rawRows15F = xlsx.utils.sheet_to_json(wb15F.Sheets[wb15F.SheetNames[0]], { header: 1 });

  // Rows 6 to 148 (STT 2 to 144) + Row 152 (STT 148)
  const active15F = [];
  for (let r = 6; r <= 148; r++) {
    active15F.push({ r: rawRows15F[r], scan: String(r - 4).padStart(3, '0') + '.jpg' });
  }
  active15F.push({ r: rawRows15F[152], scan: '148.jpg' });

  const starts15F = [
    1, 3, 4, 6, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
    29, 30, 31, 32, 33, 34, 35, 36, 38, 40, 42, 43, 45, 47, 48, 49, 51, 53, 55, 57,
    58, 61, 62, 64, 67, 68, 71, 73, 76, 77, 78, 79, 82, 83, 84, 85, 86, 87, 88, 89,
    91, 92, 96, 97, 98, 99, 101, 102, 103, 105, 107, 108, 110, 115, 117, 125, 128, 130, 131, 133,
    134, 135, 136, 137, 138, 139, 140, 144, 145, 147, 149, 150, 151, 152, 153, 154, 155, 156, 157, 165,
    166, 168, 171, 172, 174, 175, 176, 177, 182, 185, 188, 190, 192, 194, 195, 198, 203, 205, 206, 207,
    208, 211, 212, 214, 217, 219, 220, 222, 223, 224, 226, 234, 235, 237, 241, 243, 245, 246, 249, 250,
    253, 254, 257, 258, 259
  ];

  const rowsConfig15F = [];
  for (let i = 0; i < active15F.length; i++) {
    const { r, scan } = active15F[i];
    const s = starts15F[i];
    const e = starts15F[i + 1] - 1;
    let so = (r[1] || '').toString().trim();
    if (so === '04./QĐ-UBND') so = '04/QĐ-UBND';
    if (so === '15./QĐ-UBND') so = '15/QĐ-UBND';
    if (so === '21.../QĐ-UBND') so = '21/QĐ-UBND';
    if (so === '22./QĐ-UBND') so = '22/QĐ-UBND';
    if (so === '34./QĐ-UBND') so = '34/QĐ-UBND';
    if (so === '72.../QĐ-UBND') so = '72/QĐ-UBND';
    if (so === '109-6/QĐ-UBND') so = '109b/QĐ-UBND';
    if (so === '11-QĐ-UBND') so = '111/QĐ-UBND';
    if (so === '1262/QĐ-UBND') so = '126b/QĐ-UBND';
    if (so === '431/QĐ-UBND') so = '131/QĐ-UBND';
    if (so === '108/QĐ-UBND' && scan === '148.jpg') so = '108b/QĐ-UBND';

    rowsConfig15F.push({
      p: scan,
      so: so,
      d: (r[2] || '').toString().trim(),
      ty: (r[3] || '').toString().trim(),
      tg: (r[4] || 'Ủy ban nhân dân xã Phú Lộc').toString().trim(),
      toSo: formatRange(s, e),
      loaiBan: (r[6] || 'Bản gốc').toString().trim()
    });
  }

  await processDossier({
    dosId: 'PL_2015_15F',
    title: 'HỒ SƠ QUYẾT ĐỊNH',
    year: '2015',
    skipFiles: ['001.jpg', '145.jpg', '146.jpg', '147.jpg'],
    rowsConfig: rowsConfig15F
  });

  // Sync duplicate items of 15F
  console.log('Syncing duplicates of PL_2015_15F...');
  await appendTaiLieuLoai({
    type: 'trung',
    tenVanBan: 'Quyết định số 149/QĐ-UBND ngày 17/12/2015 về việc thu hồi và hủy bỏ Thông báo số 36/TB-UBND (bản trùng đánh dấu bút chì)',
    soHoSo: 'PL_2015_15F',
    lyDoTrung: 'Trùng hs PL_2015_15F (bản trùng)'
  });
  await appendTaiLieuLoai({
    type: 'trung',
    tenVanBan: 'Quyết định số 153/QĐ-UBND ngày 29/12/2015 về việc phê duyệt hồ sơ mời thầu Đường nhà máy hạt điều (bản trùng scan 147)',
    soHoSo: 'PL_2015_15F',
    lyDoTrung: 'Trùng hs PL_2015_15F'
  });
  await appendTaiLieuLoai({
    type: 'trung',
    tenVanBan: 'Quyết định số 108b/QĐ-UBND về việc phê duyệt điều chỉnh Tổng dự toán Nhà ở Xã đội (bản dự thảo/trùng scan 145)',
    soHoSo: 'PL_2015_15F',
    lyDoTrung: 'Trùng hs PL_2015_15F'
  });

  // =========================================================================
  // 3. PL_2015_15K (187 active rows, sheets 01-353)
  // =========================================================================
  console.log('\nLoading raw PL_2015_15K.xlsx...');
  const wb15K = xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15K.xlsx'));
  const rawRows15K = xlsx.utils.sheet_to_json(wb15K.Sheets[wb15K.SheetNames[0]], { header: 1 });
  const rawData15K = rawRows15K.slice(6); // STT 1 starts at row index 6

  const active15K = [];
  rawData15K.forEach((r, idx) => {
    const stt = parseInt(r[0], 10);
    if (stt === 1 || stt === 67 || stt === 72 || stt === 181) return;
    active15K.push({
      p: String(stt).padStart(3, '0') + '.jpg',
      so: (r[1] || '').toString().trim(),
      d: (r[2] || '').toString().trim(),
      ty: (r[3] || '').toString().trim(),
      tg: (r[4] || 'Ủy ban nhân dân xã Phú Lộc').toString().trim(),
      loaiBan: (r[6] || 'Bản gốc').toString().trim()
    });
  });

  const starts15K = [
    1, 2, 4, 8, 14, 18, 20, 22, 24, 26, 28, 30, 31, 33, 35, 39, 41, 43, 44, 45,
    46, 47, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 68,
    70, 72, 74, 78, 84, 91, 93, 95, 97, 99, 100, 103, 105, 107, 109, 112, 114, 116, 118, 120,
    122, 124, 126, 130, 135, 138, 140, 145, 147, 149, 153, 154, 155, 156, 158, 159, 160, 162, 164, 166,
    169, 170, 172, 174, 176, 180, 181, 187, 188, 189, 190, 191, 192, 193, 198, 199, 201, 202, 203, 204,
    205, 206, 208, 211, 217, 219, 221, 230, 231, 232, 233, 234, 235, 240, 243, 244, 246, 249, 251, 253,
    254, 259, 260, 262, 263, 265, 266, 267, 269, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281,
    282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301,
    302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 318, 321, 331, 333, 335,
    336, 338, 340, 345, 347, 350, 353, 354
  ];

  const rowsConfig15K = [];
  for (let i = 0; i < active15K.length; i++) {
    const item = active15K[i];
    const s = starts15K[i];
    const e = starts15K[i + 1] - 1;
    rowsConfig15K.push({
      p: item.p,
      so: item.so,
      d: item.d,
      ty: item.ty,
      tg: item.tg,
      toSo: formatRange(s, e),
      loaiBan: item.loaiBan
    });
  }

  await processDossier({
    dosId: 'PL_2015_15K',
    title: 'HỒ SƠ KHEN THƯỞNG',
    year: '2015',
    skipFiles: ['001.jpg', '067.jpg', '072.jpg', '181.jpg'],
    rowsConfig: rowsConfig15K
  });

  // Sync duplicate scans of 15K
  console.log('Syncing duplicates of PL_2015_15K...');
  await appendTaiLieuLoai({
    type: 'trung',
    tenVanBan: 'Tờ trình số 01/TTr-MTX ngày 19/03/2015 về việc tặng giấy khen cho tập thể và các cá nhân thi đua yêu nước (bản trùng scan 067)',
    soHoSo: 'PL_2015_15K',
    lyDoTrung: 'Trùng hs PL_2015_15K'
  });
  await appendTaiLieuLoai({
    type: 'trung',
    tenVanBan: 'Báo cáo thành tích cá nhân ngày 26/03/2015 của Phan Thị Mỹ Hạnh, Trường THCS Nguyễn Chí Thanh (bản trùng scan 072)',
    soHoSo: 'PL_2015_15K',
    lyDoTrung: 'Trùng hs PL_2015_15K'
  });
  await appendTaiLieuLoai({
    type: 'trung',
    tenVanBan: 'Báo cáo số 63/BC-BCĐ ngày 15/07/2015 về kết quả Chương trình MTQG xây dựng NTM 05 năm (bản trùng scan 181)',
    soHoSo: 'PL_2015_15K',
    lyDoTrung: 'Trùng hs PL_2015_15K'
  });

  // Sync photo documents of 15K
  console.log('Syncing photo documents of PL_2015_15K...');
  await appendTaiLieuLoai({
    type: 'photo',
    tenVanBan: 'Công văn số 12/UBND-TĐKT ngày 16/03/2015 của UBND xã Phú Xuân về việc tổ chức hội nghị điển hình tiên tiến (hs PL_2015_15K)',
    soHoSo: 'PL_2015_15K'
  });
  await appendTaiLieuLoai({
    type: 'photo',
    tenVanBan: 'Quyết định số 06/QĐ-UBND ngày 02/06/2015 của UBND xã Phú Lộc về việc tặng Giấy khen cho các cá nhân CCB (hs PL_2015_15K)',
    soHoSo: 'PL_2015_15K'
  });

  console.log('\n========================================');
  console.log('BATCH 2015-4 COMPLETED SUCCESSFULLY!');
  console.log('========================================');
}

run().catch(err => {
  console.error('Fatal error in update_and_export_batch2015_4:', err);
  process.exit(1);
});
