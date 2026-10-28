import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function main() {
  const dosId = 'PL_2019_19G';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ khen thưởng năm 2019 xã Phú Lộc';
  job.data.tieuDeNghiQuyet = 'Hồ sơ khen thưởng năm 2019 xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = '2019';
  job.data.tongSoToText = '';

  const ocrResults = fs.existsSync('tests/inspect_19G/ocr_results_19G.json')
    ? JSON.parse(fs.readFileSync('tests/inspect_19G/ocr_results_19G.json', 'utf8'))
    : {};

  // Define sheet ranges for all 117 documents (photo 118 is page 2 of doc 117)
  const sheetRanges = [
    '01-02', '03-07', '08-11', '12', '13-23', '24-27', '28-35', '36-37', '38-39', '40-41',
    '42-43', '44-45', '46-47', '48-49', '50-51', '52-53', '54-55', '56', '57', '58',
    '59', '60', '61', '62-63', '64-67', '68-69', '70-71', '72-75', '76-79', '80-81',
    '82-84', '85-88', '89-92', '93-94', '95-96', '97-99', '100-103', '104-105', '106-107', '108-109',
    '110-111', '112', '113', '114', '115', '116', '117', '118', '119', '120',
    '121', '122', '123', '124', '125-128', '129-130', '131-133', '134-136', '137-138', '139-140',
    '141-144', '145-151', '152-153', '154-166', '167-169', '170-172', '173-179', '180-189', '190-192', '193-194',
    '195', '196', '197', '198-199', '200-201', '202-203', '204', '205', '206-207', '208-209',
    '210-211', '212-213', '214-215', '216-217', '218-219', '220-221', '222', '223-225', '226', '227',
    '228-229', '230', '231', '232', '233-234', '235-236', '237-238', '239-240', '241-242', '243-244',
    '245-247', '248-249', '250-251', '252-254', '255-257', '258-259', '260-261', '262', '263', '264',
    '265-266', '267-269', '270-271', '272', '273', '274', '275-276'
  ];

  const rows = [];

  // 1 to 28: from existing job.data.rows
  for (let i = 0; i < 28; i++) {
    const orig = job.data.rows[i] || {};
    const photoNum = i + 1;
    const fnStr = String(photoNum).padStart(3, '0') + '.jpg';
    const toSo = sheetRanges[i];
    const isPhoto = (orig.loaiBan === 'Photo' || (orig.soKyHieuVanBan && orig.soKyHieuVanBan.includes('06/QĐ-UBND')));
    const loaiBan = isPhoto ? 'Photo' : (orig.loaiBan || 'Bản gốc');

    rows.push({
      soTT: String(i + 1),
      soKyHieuVanBan: orig.soKyHieuVanBan || '',
      ngayThangVanBan: orig.ngayThangVanBan || '',
      tenLoaiTrichYeu: orig.tenLoaiTrichYeu || '',
      tacGiaVanBan: orig.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: toSo,
      loaiBan: loaiBan,
      ghiChu: '',
      banGocChinh: (loaiBan === 'Photo' ? '' : loaiBan),
      banSao: (loaiBan === 'Photo' ? 'Photo' : ''),
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: [fnStr]
    });
  }

  // 29 to 102: from ocrResults
  for (let photoNum = 29; photoNum <= 102; photoNum++) {
    const fnStr = String(photoNum).padStart(3, '0') + '.jpg';
    const ocr = ocrResults[fnStr] || {};
    const idx = photoNum - 1;
    const toSo = sheetRanges[idx];
    const loaiBan = ocr.loaiBan || 'Bản gốc';

    rows.push({
      soTT: String(idx + 1),
      soKyHieuVanBan: ocr.soKyHieuVanBan || '',
      ngayThangVanBan: ocr.ngayThangVanBan || '',
      tenLoaiTrichYeu: ocr.tenLoaiTrichYeu || '',
      tacGiaVanBan: ocr.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: toSo,
      loaiBan: loaiBan,
      ghiChu: '',
      banGocChinh: (loaiBan === 'Photo' ? '' : loaiBan),
      banSao: (loaiBan === 'Photo' ? 'Photo' : ''),
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: [fnStr]
    });
  }

  // 103 to 117 (photo 118 merged into 117): verified visually
  const manualEnd = [
    {
      source: '103.jpg',
      soKyHieu: '',
      ngayThang: '23/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị UBND xã tặng giấy khen cho cá nhân có thành tích xuất sắc trong phong trào thi đua yêu nước năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      loaiBan: 'Bản gốc'
    },
    {
      source: '104.jpg',
      soKyHieu: '',
      ngayThang: '23/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị UBND xã tặng giấy khen cho tập thể có thành tích xuất sắc trong phong trào thi đua yêu nước năm 2019 (Chi Đoàn Mầm Non Phú Lộc)',
      tacGia: 'Chi Đoàn Mầm Non Phú Lộc',
      loaiBan: 'Bản gốc'
    },
    {
      source: '105.jpg',
      soKyHieu: '',
      ngayThang: '23/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị UBND xã tặng giấy khen cho tập thể có thành tích xuất sắc trong phong trào thi đua yêu nước năm 2019 (Chi đoàn ấp 1 xã Phú Lộc)',
      tacGia: 'Chi đoàn ấp 1 xã Phú Lộc',
      loaiBan: 'Bản gốc'
    },
    {
      source: '106.jpg',
      soKyHieu: '',
      ngayThang: '23/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị UBND xã tặng giấy khen cho cá nhân có thành tích xuất sắc trong phong trào thi đua yêu nước năm 2019, đ/c Trương Thị Trung',
      tacGia: 'Trương Thị Trung',
      loaiBan: 'Bản gốc'
    },
    {
      source: '107.jpg',
      soKyHieu: '',
      ngayThang: '25/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, Trịnh Minh Vân',
      tacGia: 'Trịnh Minh Vân',
      loaiBan: 'Bản gốc'
    },
    {
      source: '108.jpg',
      soKyHieu: '',
      ngayThang: '25/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, Nguyễn Minh Xin',
      tacGia: 'Nguyễn Minh Xin',
      loaiBan: 'Bản gốc'
    },
    {
      source: '109.jpg',
      soKyHieu: '',
      ngayThang: '25/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, Lê Tuấn Giới',
      tacGia: 'Lê Tuấn Giới',
      loaiBan: 'Bản gốc'
    },
    {
      source: '110.jpg',
      soKyHieu: '',
      ngayThang: '25/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, Chương A Nhì',
      tacGia: 'Chương A Nhì',
      loaiBan: 'Bản gốc'
    },
    {
      source: '111.jpg',
      soKyHieu: '',
      ngayThang: '25/12/2019',
      trichYeu: 'Báo cáo thành tích tập thể Đề nghị UBND xã tặng giấy khen (Đội dân phòng xã Phú Lộc)',
      tacGia: 'Đội dân phòng xã Phú Lộc',
      loaiBan: 'Bản gốc'
    },
    {
      source: '112.jpg',
      soKyHieu: '14/QĐ-UBND',
      ngayThang: '26/12/2019',
      trichYeu: 'Quyết định về việc Tặng Giấy khen cho các tập thể và cá nhân có thành tích xuất sắc trong phong trào thi đua yêu nước năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      loaiBan: 'Bản chính'
    },
    {
      source: '113.jpg',
      soKyHieu: '',
      ngayThang: '26/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã (Hội Cựu chiến binh xã Phú Lộc)',
      tacGia: 'Hội Cựu chiến binh xã Phú Lộc',
      loaiBan: 'Bản gốc'
    },
    {
      source: '114.jpg',
      soKyHieu: '',
      ngayThang: '26/12/2019',
      trichYeu: 'Báo cáo thành tích Đề nghị UBND xã tặng giấy khen, Lộc Vĩnh Quay',
      tacGia: 'Lộc Vĩnh Quay',
      loaiBan: 'Bản gốc'
    },
    {
      source: '115.jpg',
      soKyHieu: '',
      ngayThang: '26/12/2019',
      trichYeu: 'Báo cáo thành tích Đề nghị UBND xã tặng giấy khen, Trần Anh Duy',
      tacGia: 'Trần Anh Duy',
      loaiBan: 'Bản gốc'
    },
    {
      source: '116.jpg',
      soKyHieu: '',
      ngayThang: '26/12/2019',
      trichYeu: 'Danh sách Tặng Giấy khen cho các cá nhân có thành tích xuất sắc trong phong trào "Ngày hội toàn dân bảo vệ an ninh Tổ quốc" năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      loaiBan: 'Bản chính'
    },
    {
      source: '117.jpg',
      sources: ['117.jpg', '118.jpg'],
      soKyHieu: '',
      ngayThang: '26/12/2019',
      trichYeu: 'Báo cáo thành tích Đề nghị UBND xã tặng giấy khen cho cá nhân có thành tích xuất sắc trong năm 2019, Vũ Văn Tuấn',
      tacGia: 'Vũ Văn Tuấn',
      loaiBan: 'Bản gốc'
    }
  ];

  for (let i = 0; i < manualEnd.length; i++) {
    const item = manualEnd[i];
    const photoNum = 103 + i;
    const idx = photoNum - 1;
    const toSo = sheetRanges[idx];

    rows.push({
      soTT: String(idx + 1),
      soKyHieuVanBan: item.soKyHieu,
      ngayThangVanBan: item.ngayThang,
      tenLoaiTrichYeu: item.trichYeu,
      tacGiaVanBan: item.tacGia,
      toSoTrangSo: toSo,
      loaiBan: item.loaiBan,
      ghiChu: '',
      banGocChinh: (item.loaiBan === 'Photo' ? '' : item.loaiBan),
      banSao: (item.loaiBan === 'Photo' ? 'Photo' : ''),
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: item.sources || [item.source]
    });
  }

  job.data.rows = rows;
  job.data.rowsTrung = [];
  job.status = 'completed';
  job.updatedAt = new Date().toISOString();

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Updated job for ${dosId}: total ${rows.length} rows.`);

  // Export to both locations
  const out1 = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  const out2 = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  await exportJsonToExcel(job, out1);
  await exportJsonToExcel(job, out2);
  console.log(`Exported ${dosId} to Da_check and PL_outputOCR.`);

  // Sync any Photo rows to Tl_loại_VP_Toàn_PL.xlsx
  for (const r of rows) {
    if (r.loaiBan === 'Photo') {
      await appendTaiLieuLoai({
        type: 'photo',
        tenVanBan: r.tenLoaiTrichYeu,
        soHoSo: dosId,
        thbq: 'Vĩnh viễn'
      });
      console.log(`Synced Photo doc to Tl_loại: '${r.tenLoaiTrichYeu.slice(0, 40)}'`);
    }
  }

  console.log(`Finalized PL_2019_19G successfully!`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
