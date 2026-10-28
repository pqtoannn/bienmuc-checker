import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// ==========================================
// 1. PROCESS PL_2020_20K
// ==========================================
async function process20K() {
  console.log('\n>>> PROCESSING PL_2020_20K...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20K.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 15 photos: 001 is cover, 015 is closing page of 014
  // Active documents: 002 to 014 (13 documents)
  const starts = {
    2: 1, 3: 3, 4: 7, 5: 10, 6: 11, 7: 17, 8: 19, 9: 20, 10: 21,
    11: 22, 12: 23, 13: 26, 14: 27
  };

  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
  const pad = n => String(n).padStart(2, '0');
  const ranges = {};

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const cur = starts[p];
    if (p === 14) {
      ranges[p] = `${pad(cur)}-28`;
    } else {
      const nextP = keys[i + 1];
      const next = starts[nextP];
      if (next - 1 === cur) {
        ranges[p] = pad(cur);
      } else {
        ranges[p] = `${pad(cur)}-${pad(next - 1)}`;
      }
    }
  }

  // Backup original
  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  job.images = [];
  for (let i = 1; i <= 15; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1 || i === 15);
    job.images.push({
      fileName: fn,
      status: isSkip ? 'skip' : 'active',
      isExcluded: isSkip
    });
  }

  const activeRows = [
    {
      soTT: '1',
      soKyHieuVanBan: '',
      ngayThangVanBan: '16/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng giấy khen của Chủ tịch UBND xã, đơn vị: Hội Liên hiệp Phụ nữ xã Phú Lộc',
      tacGiaVanBan: 'Hội Liên hiệp Phụ nữ xã Phú Lộc',
      toSoTrangSo: ranges[2],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['002.jpg']
    },
    {
      soTT: '2',
      soKyHieuVanBan: '',
      ngayThangVanBan: '16/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng giấy khen của Chủ tịch UBND xã, đơn vị: Đoàn Thanh niên xã Phú Lộc',
      tacGiaVanBan: 'Đoàn Thanh niên xã Phú Lộc',
      toSoTrangSo: ranges[3],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['003.jpg']
    },
    {
      soTT: '3',
      soKyHieuVanBan: '',
      ngayThangVanBan: '16/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng giấy khen của Chủ tịch UBND xã, đơn vị: Hội Cựu chiến binh xã Phú Lộc',
      tacGiaVanBan: 'Hội Cựu chiến binh xã Phú Lộc',
      toSoTrangSo: ranges[4],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['004.jpg']
    },
    {
      soTT: '4',
      soKyHieuVanBan: '',
      ngayThangVanBan: '16/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng giấy khen của Chủ tịch UBND xã, đơn vị: Ban Nhân dân Ấp 4',
      tacGiaVanBan: 'UBND xã Phú Lộc - Ban Nhân dân Ấp 4',
      toSoTrangSo: ranges[5],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['005.jpg']
    },
    {
      soTT: '5',
      soKyHieuVanBan: '',
      ngayThangVanBan: '18/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng giấy khen của Chủ tịch UBND xã, bà Nguyễn Thị Xuân',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: ranges[6],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['006.jpg']
    },
    {
      soTT: '6',
      soKyHieuVanBan: '',
      ngayThangVanBan: '19/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng giấy khen của Chủ tịch UBND xã, ông Phan Minh Trường An',
      tacGiaVanBan: 'Công an xã Phú Lộc',
      toSoTrangSo: ranges[7],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['007.jpg']
    },
    {
      soTT: '7',
      soKyHieuVanBan: '',
      ngayThangVanBan: '19/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng giấy khen của Chủ tịch UBND xã, đơn vị: Hội Nông dân xã Phú Lộc',
      tacGiaVanBan: 'Hội Nông dân xã Phú Lộc',
      toSoTrangSo: ranges[8],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['008.jpg']
    },
    {
      soTT: '8',
      soKyHieuVanBan: '',
      ngayThangVanBan: '25/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị UBND xã tặng giấy khen, ông Trần Ngọc Thắng',
      tacGiaVanBan: 'Công an xã Phú Lộc',
      toSoTrangSo: ranges[9],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['009.jpg']
    },
    {
      soTT: '9',
      soKyHieuVanBan: '',
      ngayThangVanBan: '25/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị UBND xã tặng giấy khen, ông Trịnh Minh Văn',
      tacGiaVanBan: 'Công an xã Phú Lộc',
      toSoTrangSo: ranges[10],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['010.jpg']
    },
    {
      soTT: '10',
      soKyHieuVanBan: '',
      ngayThangVanBan: '25/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị UBND xã tặng giấy khen, ông Lê Minh Phước',
      tacGiaVanBan: 'Công an xã Phú Lộc',
      toSoTrangSo: ranges[11],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['011.jpg']
    },
    {
      soTT: '11',
      soKyHieuVanBan: '',
      ngayThangVanBan: '29/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị Chủ tịch UBND xã tặng giấy khen, tập thể: Ủy ban Mặt trận Tổ quốc Việt Nam xã Phú Lộc',
      tacGiaVanBan: 'Ủy ban Mặt trận Tổ quốc Việt Nam xã Phú Lộc',
      toSoTrangSo: ranges[12],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['012.jpg']
    },
    {
      soTT: '12',
      soKyHieuVanBan: '',
      ngayThangVanBan: '30/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng giấy khen, đơn vị: Công an xã Phú Lộc',
      tacGiaVanBan: 'Công an xã Phú Lộc',
      toSoTrangSo: ranges[13],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['013.jpg']
    },
    {
      soTT: '13',
      soKyHieuVanBan: '',
      ngayThangVanBan: '30/12/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2020, ông Nguyễn Phước Tài',
      tacGiaVanBan: 'Hội đồng nhân dân xã Phú Lộc',
      toSoTrangSo: ranges[14],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: ['014.jpg']
    }
  ];

  job.data.tenHoSo = 'Hồ sơ báo cáo thành tích đề nghị khen thưởng của UBND xã Phú Lộc năm 2020';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Định Quán';
  job.data.donVi = 'UBND xã Phú Lộc';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Từ ngày 16/12/2020 đến ngày 30/12/2020';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 28 tờ`;
  job.data.thbq = 'Vĩnh viễn';
  job.data.banTo = 'Văn phòng';
  job.data.rows = activeRows;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  const excelDaCheck = path.join(DA_CHECK_DIR, 'PL_2020_20K.xlsx');
  const excelOcr = path.join(OUTPUT_OCR_DIR, 'PL_2020_20K.xlsx');
  await exportJsonToExcel(job.data, excelDaCheck);
  await exportJsonToExcel(job.data, excelOcr);
  console.log(`Saved 20K Excel files successfully (${activeRows.length} rows, sheets 01-28)`);
}

// ==========================================
// 2. PROCESS PL_2020_20L
// ==========================================
async function process20L() {
  console.log('\n>>> PROCESSING PL_2020_20L...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20L.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 102 photos: 001 is cover, 102 is closing page of 101
  // Active documents: 002 to 101 (100 documents)
  const starts = {
    2: 1, 3: 6, 4: 8, 5: 10, 6: 12, 7: 16, 8: 18, 9: 22, 10: 27,
    11: 28, 12: 36, 13: 37, 14: 38, 15: 39, 16: 40, 17: 41, 18: 42, 19: 43, 20: 45,
    21: 46, 22: 49, 23: 51, 24: 52, 25: 53, 26: 54, 27: 55, 28: 56, 29: 58, 30: 60,
    31: 73, 32: 74, 33: 75, 34: 77, 35: 78, 36: 85, 37: 92, 38: 93, 39: 96, 40: 99,
    41: 101, 42: 103, 43: 106, 44: 108, 45: 111, 46: 114, 47: 116, 48: 118, 49: 120, 50: 123,
    51: 126, 52: 128, 53: 130, 54: 132, 55: 134, 56: 136, 57: 138, 58: 140, 59: 142, 60: 144,
    61: 146, 62: 148, 63: 150, 64: 152, 65: 154, 66: 156, 67: 158, 68: 160, 69: 162, 70: 164,
    71: 166, 72: 168, 73: 170, 74: 175, 75: 178, 76: 180, 77: 181, 78: 183, 79: 186, 80: 188,
    81: 190, 82: 192, 83: 194, 84: 196, 85: 198, 86: 200, 87: 202, 88: 204, 89: 206, 90: 215,
    91: 219, 92: 223, 93: 225, 94: 242, 95: 245, 96: 246, 97: 249, 98: 250, 99: 252, 100: 253,
    101: 259
  };

  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
  const pad = n => String(n).padStart(2, '0');
  const ranges = {};

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const cur = starts[p];
    if (p === 101) {
      ranges[p] = `${pad(cur)}-266`;
    } else {
      const nextP = keys[i + 1];
      const next = starts[nextP];
      if (next - 1 === cur) {
        ranges[p] = pad(cur);
      } else {
        ranges[p] = `${pad(cur)}-${pad(next - 1)}`;
      }
    }
  }

  // Backup original
  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  job.images = [];
  for (let i = 1; i <= 102; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1 || i === 102);
    job.images.push({
      fileName: fn,
      status: isSkip ? 'skip' : 'active',
      isExcluded: isSkip
    });
  }

  const activeRows = [];
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const fn = String(p).padStart(3, '0') + '.jpg';
    const r = job.data.rows.find(row => row.sourceFileNames && row.sourceFileNames.includes(fn)) || job.data.rows[p - 1];

    let trichYeu = (r.tenLoaiTrichYeu || '').trim();
    trichYeu = trichYeu.replace(/^v\/v:?\s*/i, 'về việc ');
    let soKyHieu = (r.soKyHieuVanBan || '').trim().replace(/^Số:?\s*/i, '');
    let ngayThang = (r.ngayThangVanBan || '').trim();
    let tacGia = (r.tacGiaVanBan || 'UBND xã Phú Lộc').trim();

    // Specific corrections from visual inspection:
    if (p === 2) {
      soKyHieu = '';
      tacGia = 'Huyện đoàn Tân Phú - Ban Chấp hành Đoàn xã Phú Lộc';
      ngayThang = '08/01/2020';
    }
    if (p === 8) {
      soKyHieu = '03/QĐ-UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '15/01/2020';
    }
    if (p === 10) {
      soKyHieu = '05/QĐ-UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '10/02/2020';
    }
    if (p === 11) {
      soKyHieu = '11/BC-UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '24/02/2020';
    }
    if (p === 33) {
      soKyHieu = '07/TTr-HĐ.NVQS';
      tacGia = 'UBND xã Phú Lộc - Hội đồng NVQS';
      ngayThang = '18/03/2020';
    }
    if (p === 91) {
      soKyHieu = '16/TB-HĐ.TĐKT';
      tacGia = 'UBND xã Phú Lộc - Hội đồng TĐKT';
      ngayThang = '23/03/2020';
    }
    if (p === 92) {
      soKyHieu = '04/QĐ-UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '28/03/2020';
    }
    if (p === 93) {
      soKyHieu = '04/QĐ-UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '28/03/2020';
    }
    if (p === 94) {
      soKyHieu = '';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '28/03/2020';
      trichYeu = 'Danh sách các tập thể và cá nhân điển hình tiên tiến trong phong trào thi đua yêu nước 5 năm giai đoạn 2015 - 2020 (Kèm theo Quyết định số 04/QĐ-UBND ngày 28/03/2020 của Chủ tịch UBND xã Phú Lộc)';
    }
    if (p === 95) {
      soKyHieu = '05/QĐ-UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '30/03/2020';
    }
    if (p === 96) {
      soKyHieu = '26/BC-UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '01/04/2020';
    }
    if (p === 97) {
      soKyHieu = '865/UBND-TĐKT';
      tacGia = 'UBND huyện Tân Phú';
      ngayThang = '09/04/2020';
    }
    if (p === 98) {
      soKyHieu = '22/TTr-UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '12/04/2020';
    }
    if (p === 99) {
      soKyHieu = '1382/UBND-TĐKT';
      tacGia = 'UBND huyện Tân Phú';
      ngayThang = '02/06/2020';
    }
    if (p === 100) {
      soKyHieu = '84/BC-UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '15/06/2020';
    }
    if (p === 101) {
      soKyHieu = '06/QĐ-UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '18/06/2020';
    }

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: ngayThang,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: ranges[p],
      loaiBan: r.loaiBan || 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: [fn]
    });
  }

  job.data.tenHoSo = 'Hồ sơ về công tác thi đua, khen thưởng của Ủy ban nhân dân xã Phú Lộc năm 2020 (Tập 1)';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Định Quán';
  job.data.donVi = 'UBND xã Phú Lộc';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Từ ngày 08/01/2020 đến ngày 18/06/2020';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 266 tờ`;
  job.data.thbq = 'Vĩnh viễn';
  job.data.banTo = 'Văn phòng';
  job.data.rows = activeRows;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  const excelDaCheck = path.join(DA_CHECK_DIR, 'PL_2020_20L.xlsx');
  const excelOcr = path.join(OUTPUT_OCR_DIR, 'PL_2020_20L.xlsx');
  await exportJsonToExcel(job.data, excelDaCheck);
  await exportJsonToExcel(job.data, excelOcr);
  console.log(`Saved 20L Excel files successfully (${activeRows.length} rows, sheets 01-266)`);
}

async function main() {
  await process20K();
  await process20L();
  console.log('\n========================================');
  console.log('BATCH 2020-6 PROCESSED AND EXPORTED SUCCESSFULLY!');
  console.log('========================================');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
