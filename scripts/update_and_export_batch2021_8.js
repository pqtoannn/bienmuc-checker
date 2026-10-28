import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// ==========================================
// 1. PROCESS PL_2021_21Q
// ==========================================
async function process21Q() {
  console.log('\n>>> PROCESSING PL_2021_21Q...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21Q.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // PL_2021_21Q has 17 photos on disk (001.jpg to 017.jpg)
  // 001.jpg is cover note -> exclude
  // 002.jpg to 015.jpg: active single-photo docs (each 2 sheets: 01-02, 03-04, ..., 27-28)
  // 016.jpg and 017.jpg: page 1 and page 2 of doc 15 (sheets 29-30)
  // Total active documents: 15
  // Total sheets: 30

  // 15 clean documents specification
  const docs21Q = [
    {
      photos: ['002.jpg'],
      toSo: '01-02',
      ngay: '05/01/2021',
      soKyHieu: '',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã về tập thể Ban nhân dân ấp 1, xã Phú Lộc'
    },
    {
      photos: ['003.jpg'],
      toSo: '03-04',
      ngay: '05/01/2021',
      soKyHieu: '',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã về tập thể Ban nhân dân ấp 2, xã Phú Lộc'
    },
    {
      photos: ['004.jpg'],
      toSo: '05-06',
      ngay: '05/01/2021',
      soKyHieu: '',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã về tập thể Ban nhân dân ấp 3, xã Phú Lộc'
    },
    {
      photos: ['005.jpg'],
      toSo: '07-08',
      ngay: '05/01/2021',
      soKyHieu: '',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã về tập thể Ban Chỉ huy Quân sự xã Phú Lộc'
    },
    {
      photos: ['006.jpg'],
      toSo: '09-10',
      ngay: '05/01/2021',
      soKyHieu: '',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã về tập thể Ban nhân dân ấp 5, xã Phú Lộc'
    },
    {
      photos: ['007.jpg'],
      toSo: '11-12',
      ngay: '05/01/2021',
      soKyHieu: '',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, ông Nguyễn Duy Quang'
    },
    {
      photos: ['008.jpg'],
      toSo: '13-14',
      ngay: '05/01/2021',
      soKyHieu: '',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, ông Nguyễn Hoàng Khang'
    },
    {
      photos: ['009.jpg'],
      toSo: '15-16',
      ngay: '05/01/2021',
      soKyHieu: '',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, ông Nguyễn Thành Đang'
    },
    {
      photos: ['010.jpg'],
      toSo: '17-18',
      ngay: '05/01/2021',
      soKyHieu: '',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, ông Nguyễn Hoàng Dẫn'
    },
    {
      photos: ['011.jpg'],
      toSo: '19-20',
      ngay: '22/01/2021',
      soKyHieu: '',
      tacGia: 'Hội đồng nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã Phú Lộc năm 2021, ông Huỳnh Văn Đức - Trưởng ban công tác Mặt trận ấp 5'
    },
    {
      photos: ['012.jpg'],
      toSo: '21-22',
      ngay: '2021',
      soKyHieu: '',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Bằng khen của Chủ tịch UBND xã về tập thể Ban Chỉ huy Quân sự xã Phú Lộc'
    },
    {
      photos: ['013.jpg'],
      toSo: '23-24',
      ngay: '25/01/2021',
      soKyHieu: '',
      tacGia: 'Hội đồng nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng Giấy khen của Chủ tịch UBND xã về tập thể Hội đồng nhân dân xã Phú Lộc'
    },
    {
      photos: ['014.jpg'],
      toSo: '25-26',
      ngay: '25/01/2021',
      soKyHieu: '',
      tacGia: 'Hội đồng nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, ông Nguyễn Đào Thanh Tần - Phó Chủ tịch Hội đồng nhân dân xã Phú Lộc'
    },
    {
      photos: ['015.jpg'],
      toSo: '27-28',
      ngay: '25/01/2021',
      soKyHieu: '',
      tacGia: 'Hội đồng nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, ông Nguyễn Ngọc Tú - Chủ tịch Hội đồng nhân dân xã Phú Lộc'
    },
    {
      photos: ['016.jpg', '017.jpg'],
      toSo: '29-30',
      ngay: '25/01/2021',
      soKyHieu: '',
      tacGia: 'Hội đồng nhân dân xã Phú Lộc',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, ông Nguyễn Hoài Thương - Đại biểu Hội đồng nhân dân xã Phú Lộc'
    }
  ];

  // Update job.images
  job.images = [];
  for (let i = 1; i <= 17; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    job.images.push({
      fileName: fn,
      status: i === 1 ? 'skip' : 'active',
      isExcluded: i === 1
    });
  }

  // Construct active rows
  job.data.rows = docs21Q.map((doc, idx) => ({
    soTT: String(idx + 1),
    soKyHieuVanBan: doc.soKyHieu,
    ngayThangVanBan: doc.ngay,
    tenLoaiTrichYeu: doc.trichYeu,
    tacGiaVanBan: doc.tacGia,
    toSoTrangSo: doc.toSo,
    loaiBan: 'Bản gốc',
    ghiChu: '',
    banGocChinh: 'Bản gốc',
    banSao: '',
    doMat: '',
    sourceFileNames: doc.photos
  }));

  job.data.tenHoSo = 'Hồ sơ báo cáo thành tích đề nghị khen thưởng của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21Q';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 05/01/2021 đến ngày 25/01/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';
  job.data.tongSoToText = `Bản mục lục này gồm 15 văn bản, 30 tờ`;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21Q.job.json');

  const exportData21Q = {
    ...job.data,
    rows: job.data.rows
  };

  const res1Q = await exportJsonToExcel(exportData21Q, path.join(DA_CHECK_DIR, 'PL_2021_21Q.xlsx'));
  const res2Q = await exportJsonToExcel(exportData21Q, path.join(OUTPUT_OCR_DIR, 'PL_2021_21Q.xlsx'));
  console.log('Exported 21Q Da_check:', res1Q);
  console.log('Exported 21Q PL_outputOCR:', res2Q);
}

// ==========================================
// 2. PROCESS PL_2021_21R
// ==========================================
async function process21R() {
  console.log('\n>>> PROCESSING PL_2021_21R...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2021_21R.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 159 photos:
  // idx 0 is cover (001.jpg) -> exclude
  // idx 1 to 156 (002.jpg to 157.jpg) -> 156 active documents
  // idx 157 & 158 (158.jpg and 159.jpg) -> page 1 & page 2 of doc 157 (357-358)
  // Total active documents: 157
  // Total sheets: 358

  const startsMap21R = {
    2: 1, 3: 3, 4: 5, 5: 7, 6: 8, 7: 10, 8: 11, 9: 13,
    10: '14a', 11: '14b', 12: '14c', 13: '14d', 14: '14e',
    15: 15, 16: 17, 17: 23, 18: 26, 19: 37, 20: 39,
    21: 44, 22: 46, 23: 56, 24: 58, 25: 61, 26: 65, 27: 67, 28: 69, 29: 71, 30: 72,
    31: 73, 32: 75, 33: 76, 34: 78, 35: 80, 36: 81, 37: 83, 38: 84, 39: 86, 40: 87,
    41: 88, 42: 90, 43: 92, 44: 95, 45: 97, 46: 99, 47: 101, 48: 106, 49: 108, 50: 110,
    51: 112, 52: 114, 53: 116, 54: 117, 55: 118, 56: 119, 57: 126, 58: 128, 59: 130, 60: 132,
    61: 134, 62: 135, 63: 136, 64: 138, 65: 140, 66: 143, 67: 146, 68: 147, 69: 150, 70: 153,
    71: 155, 72: 170, 73: 176, 74: 177, 75: 180, 76: 190, 77: 195, 78: 196, 79: 199, 80: 201,
    81: 203, 82: 205, 83: 207, 84: 209, 85: 212, 86: 214, 87: 216, 88: 218, 89: 220, 90: 221,
    91: 222, 92: 223, 93: 224, 94: 225, 95: 226, 96: 227, 97: 229, 98: 230, 99: 231, 100: 232,
    101: 235, 102: 236, 103: 238, 104: 240, 105: 241, 106: 243, 107: 244, 108: 245, 109: 246, 110: 247,
    111: 248, 112: 249, 113: 250, 114: 251, 115: 252, 116: 254, 117: 255, 118: 257, 119: 258, 120: 260,
    121: 262, 122: 263, 123: 266, 124: 268, 125: 270, 126: 272, 127: 274, 128: 279, 129: 285, 130: 288,
    131: 289, 132: 296, 133: 299, 134: 303, 135: 307, 136: 309, 137: 311, 138: 314, 139: 315, 140: 317,
    141: 318, 142: 320, 143: 322, 144: 324, 145: 326, 146: 328, 147: 330, 148: 332, 149: 334, 150: 337,
    151: 341, 152: 345, 153: 346, 154: 351, 155: 352, 156: 354, 157: 356, 158: 357
  };

  const keys = Object.keys(startsMap21R).map(Number).sort((a,b)=>a-b);
  const ranges21R = {};

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const val = startsMap21R[p];
    if (typeof val === 'string') {
      ranges21R[p] = val;
    } else {
      let nextNum = null;
      for (let j = i + 1; j < keys.length; j++) {
        if (typeof startsMap21R[keys[j]] === 'number') {
          nextNum = startsMap21R[keys[j]];
          break;
        }
      }
      if (p === 9) {
        ranges21R[p] = '13-14';
      } else if (p === 158) {
        ranges21R[p] = '357-358';
      } else {
        const e = nextNum ? (nextNum - 1) : val;
        ranges21R[p] = (val === e) ? String(val).padStart(2, '0') : `${String(val).padStart(2, '0')}-${String(e).padStart(2, '0')}`;
      }
    }
  }

  job.data.tenHoSo = 'Hồ sơ khen thưởng (tập 1) của UBND xã Phú Lộc năm 2021';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.soKyHieuHoSo = 'PL_2021_21R';
  job.data.namGiaiDoan = '2021';
  job.data.thoiGianHoSo = 'Từ ngày 19/01/2021 đến ngày 10/09/2021';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.thbq = 'Vĩnh viễn';
  job.data.rowsTrung = [];

  // Update images & rows
  job.images.forEach((img, idx) => {
    const row = job.data.rows[idx];
    row.ghiChu = '';

    if (idx === 0) {
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else if (idx === 158) {
      // 159.jpg is merged into 158.jpg
      img.isExcluded = true;
      img.status = 'skip';
      row.toSoTrangSo = '';
    } else {
      const photoNum = idx + 1;
      img.isExcluded = false;
      img.status = 'active';
      row.toSoTrangSo = ranges21R[photoNum];
      row.loaiBan = 'Bản gốc';
      if (!row.tacGiaVanBan) {
        row.tacGiaVanBan = 'Ủy ban nhân dân xã Phú Lộc';
      }

      if (row.soKyHieuVanBan) {
        row.soKyHieuVanBan = row.soKyHieuVanBan.replace(/O/g, '0').trim();
      }
    }
  });

  // Targeted corrections for 21R
  // Row 71 (072.jpg)
  if (job.data.rows[71]) {
    job.data.rows[71].ngayThangVanBan = '15/05/2021';
    job.data.rows[71].tacGiaVanBan = 'Ban nhân dân ấp 2';
    job.data.rows[71].tenLoaiTrichYeu = 'Biên bản họp bình xét khen thưởng tập thể, cá nhân ấp 2';
  }

  // Row 72 (073.jpg)
  if (job.data.rows[72]) {
    job.data.rows[72].soKyHieuVanBan = '488/HĐ.TĐKT';
    job.data.rows[72].ngayThangVanBan = '18/05/2021';
    job.data.rows[72].tacGiaVanBan = 'Hội đồng Thi đua - Khen thưởng huyện Tân Phú';
    job.data.rows[72].tenLoaiTrichYeu = 'Công văn về việc hướng dẫn bổ sung khen thưởng kỷ niệm 30 năm ngày thành lập huyện';
  }

  // Row 73 (074.jpg)
  if (job.data.rows[73]) {
    job.data.rows[73].soKyHieuVanBan = '55/KH-TĐKT';
    job.data.rows[73].ngayThangVanBan = '20/05/2021';
    job.data.rows[73].tacGiaVanBan = 'Hội đồng Thi đua - Khen thưởng xã Phú Lộc';
    job.data.rows[73].tenLoaiTrichYeu = 'Kế hoạch Công tác thi đua, khen thưởng trong tổ chức thực hiện cuộc bầu cử Đại biểu Quốc hội khóa XV và Đại biểu Hội đồng nhân dân các cấp nhiệm kỳ 2021 - 2026';
  }

  // Row 74 (075.jpg)
  if (job.data.rows[74]) {
    job.data.rows[74].ngayThangVanBan = '20/05/2021';
    job.data.rows[74].tacGiaVanBan = 'Tổ bầu cử số 1 ấp 1, xã Phú Lộc';
    job.data.rows[74].tenLoaiTrichYeu = 'Biên bản họp xét đề nghị khen tặng giấy khen tập thể và cá nhân có thành tích xuất sắc trong công tác bầu cử đại biểu Quốc hội và HĐND các cấp nhiệm kỳ 2021 - 2026';
  }

  // Row 95 (096.jpg)
  if (job.data.rows[95]) {
    job.data.rows[95].ngayThangVanBan = '25/05/2021';
    job.data.rows[95].tacGiaVanBan = 'Ủy ban nhân dân xã Phú Lộc';
    job.data.rows[95].tenLoaiTrichYeu = 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, ông Trương Phước Trọng - PCT Hội CCB xã, Ủy viên Ban bầu cử số 2';
  }

  // Row 157 (158.jpg + 159.jpg)
  if (job.data.rows[157]) {
    job.data.rows[157].ngayThangVanBan = '10/09/2021';
    job.data.rows[157].tacGiaVanBan = 'Hội Nạn nhân chất độc da cam/Dioxin xã Phú Lộc';
    job.data.rows[157].tenLoaiTrichYeu = 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của UBND xã, ông Dương Văn Đông - UV BCH Hội Nạn nhân chất độc da cam/Dioxin xã Phú Lộc';
    job.data.rows[157].sourceFileNames = ['158.jpg', '159.jpg'];
    job.data.rows[157].toSoTrangSo = '357-358';
  }

  // Re-number active soTT
  let activeStt = 1;
  const activeRows = [];
  job.data.rows.forEach((r, idx) => {
    if (!job.images[idx]?.isExcluded) {
      r.soTT = String(activeStt++);
      activeRows.push(r);
    }
  });

  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 358 tờ`;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log('Saved updated PL_2021_21R.job.json');

  const exportData21R = {
    ...job.data,
    rows: activeRows
  };

  const res1R = await exportJsonToExcel(exportData21R, path.join(DA_CHECK_DIR, 'PL_2021_21R.xlsx'));
  const res2R = await exportJsonToExcel(exportData21R, path.join(OUTPUT_OCR_DIR, 'PL_2021_21R.xlsx'));
  console.log('Exported 21R Da_check:', res1R);
  console.log('Exported 21R PL_outputOCR:', res2R);
}

async function main() {
  await process21Q();
  await process21R();
  console.log('\n>>> COMPLETED BATCH 8 (2021)!');
}

main().catch(err => {
  console.error('Batch 8 processing failed:', err);
  process.exit(1);
});
