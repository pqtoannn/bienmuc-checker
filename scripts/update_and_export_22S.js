import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const jobPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2022_22S.job.json';
const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

// 1. Cập nhật thông tin cấp hồ sơ
job.data.donViCapTren = "Ủy ban nhân dân huyện Tân Phú";
job.data.donVi = "Ủy ban nhân dân xã Phú Lộc";
job.data.soKyHieuHoSo = "PL_2022_22S";
job.data.tenHoSo = "Hồ sơ về việc đánh giá sáng kiến năm 2022 của UBND xã Phú Lộc";
job.data.tieuDeNghiQuyet = "Hồ sơ về việc đánh giá sáng kiến năm 2022 của UBND xã Phú Lộc";
job.data.namGiaiDoan = "2022";
job.data.thoiGianHoSo = "Từ ngày 18/05/2022 đến ngày 28/11/2022";
job.data.tongSoToText = "Bản mục lục này gồm 10 văn bản, 16 tờ";
job.data.thbq = "Vĩnh viễn";
job.data.banTo = "Văn phòng";
job.data.tapSo = "01";

// 2. Cập nhật trạng thái từng ảnh
job.images = [
  { fileName: "001.jpg", status: "skip", rowIndexes: [0], error: null },
  { fileName: "002.jpg", status: "ok", rowIndexes: [1], error: null },
  { fileName: "003.jpg", status: "ok", rowIndexes: [2], error: null },
  { fileName: "004.jpg", status: "ok", rowIndexes: [3], error: null },
  { fileName: "005.jpg", status: "ok", rowIndexes: [4], error: null },
  { fileName: "006.jpg", status: "ok", rowIndexes: [5], error: null },
  { fileName: "007.jpg", status: "ok", rowIndexes: [6], error: null },
  { fileName: "008.jpg", status: "ok", rowIndexes: [7], error: null },
  { fileName: "009.jpg", status: "ok", rowIndexes: [8], error: null },
  { fileName: "010.jpg", status: "ok", rowIndexes: [9], error: null },
  { fileName: "011.jpg", status: "ok", rowIndexes: [10], error: null },
  { fileName: "012.jpg", status: "skip", rowIndexes: [11], error: null },
  { fileName: "013.jpg", status: "skip", rowIndexes: [12], error: null },
];

// 3. Cập nhật danh sách rows (13 dòng khớp 1-1 với 13 ảnh)
job.data.rows = [
  // 001.jpg - Bìa hồ sơ
  {
    isExcluded: true,
    soTT: "1",
    soKyHieuVanBan: "",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Hồ sơ Đánh giá sáng kiến Năm 2022",
    tacGiaVanBan: "",
    toSoTrangSo: "61",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 002.jpg - Danh sách trích ngang thành viên Hội đồng
  {
    isExcluded: false,
    soTT: "1",
    soKyHieuVanBan: "",
    ngayThangVanBan: "18/05/2022",
    tenLoaiTrichYeu: "Danh sách trích ngang thành viên Hội đồng công nhận sáng kiến huyện, ông Trần Cao Trí Hóa",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "01",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 003.jpg - Công văn 103/UBND
  {
    isExcluded: false,
    soTT: "2",
    soKyHieuVanBan: "103/UBND",
    ngayThangVanBan: "03/11/2022",
    tenLoaiTrichYeu: "Công văn về việc đăng ký viết báo cáo sáng kiến, kinh nghiệm năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "02",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 004.jpg - Quyết định 950/QĐ-UBND
  {
    isExcluded: false,
    soTT: "3",
    soKyHieuVanBan: "950/QĐ-UBND",
    ngayThangVanBan: "14/11/2022",
    tenLoaiTrichYeu: "Quyết định về việc thành lập Hội đồng xét công nhận sáng kiến cấp xã năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "03",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 005.jpg - Đơn yêu cầu công nhận sáng kiến (bìa xanh)
  {
    isExcluded: false,
    soTT: "4",
    soKyHieuVanBan: "",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Đơn yêu cầu công nhận sáng kiến, ông Bùi Hữu Phú",
    tacGiaVanBan: "Ban CHQS xã Phú Lộc",
    toSoTrangSo: "04",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 006.jpg - Báo cáo tóm tắt sáng kiến năm 2022
  {
    isExcluded: false,
    soTT: "5",
    soKyHieuVanBan: "",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Báo cáo tóm tắt sáng kiến năm 2022, ông Bùi Hữu Phú",
    tacGiaVanBan: "Ban CHQS xã Phú Lộc",
    toSoTrangSo: "05-06",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 007.jpg - Đơn yêu cầu công nhận sáng kiến
  {
    isExcluded: false,
    soTT: "6",
    soKyHieuVanBan: "",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Đơn yêu cầu công nhận sáng kiến, ông Bùi Hữu Phú",
    tacGiaVanBan: "Ban CHQS xã Phú Lộc",
    toSoTrangSo: "07-08",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 008.jpg - Báo cáo kết quả của sáng kiến...
  {
    isExcluded: false,
    soTT: "7",
    soKyHieuVanBan: "",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Báo cáo kết quả của sáng kiến có phạm vi ảnh hưởng và hiệu quả áp dụng trên địa bàn xã Phú Lộc, ông Bùi Hữu Phú",
    tacGiaVanBan: "Ban CHQS xã Phú Lộc",
    toSoTrangSo: "09-10",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 009.jpg - Biên bản họp Hội đồng Sáng kiến năm 2022
  {
    isExcluded: false,
    soTT: "8",
    soKyHieuVanBan: "",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Biên bản họp Hội đồng Sáng kiến năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc - Hội đồng Sáng kiến",
    toSoTrangSo: "11-12",
    loaiBan: "Bản gốc không mộc",
    ghiChu: "",
  },
  // 010.jpg - Quyết định công nhận sáng kiến năm 2022
  {
    isExcluded: false,
    soTT: "9",
    soKyHieuVanBan: "952/QĐ-HĐSK",
    ngayThangVanBan: "25/11/2022",
    tenLoaiTrichYeu: "Quyết định công nhận sáng kiến năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc - Hội đồng Sáng kiến",
    toSoTrangSo: "13-14",
    loaiBan: "Bản gốc không mộc",
    ghiChu: "",
  },
  // 011.jpg - Tờ trình 164/TTr-UBND
  {
    isExcluded: false,
    soTT: "10",
    soKyHieuVanBan: "164/TTr-UBND",
    ngayThangVanBan: "28/11/2022",
    tenLoaiTrichYeu: "Tờ trình đề nghị xét công nhận phạm vi ảnh hưởng và hiệu quả áp dụng của sáng kiến trên toàn huyện",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "15-16",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 012.jpg - Tờ trình 164/TTr-UBND (Photo)
  {
    isExcluded: true,
    soTT: "11",
    soKyHieuVanBan: "164/TTr-UBND",
    ngayThangVanBan: "28/11/2022",
    tenLoaiTrichYeu: "Tờ trình đề nghị xét công nhận phạm vi ảnh hưởng và hiệu quả áp dụng của sáng kiến trên toàn huyện",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "",
    loaiBan: "Bản gốc không mộc",
    ghiChu: "Photo",
  },
  // 013.jpg - Công văn 103/UBND (Trùng)
  {
    isExcluded: true,
    soTT: "12",
    soKyHieuVanBan: "103/UBND",
    ngayThangVanBan: "03/11/2022",
    tenLoaiTrichYeu: "Công văn về việc đăng ký viết báo cáo sáng kiến, kinh nghiệm năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "",
    loaiBan: "Bản chính",
    ghiChu: "Trùng",
  },
];

// 4. Lưu lại danh sách tài liệu loại vào rowsTrung để theo dõi
job.data.rowsTrung = [
  {
    soTT: "1",
    soKyHieuVanBan: "164/TTr-UBND",
    ngayThangVanBan: "28/11/2022",
    tenLoaiTrichYeu: "Tờ trình đề nghị xét công nhận phạm vi ảnh hưởng và hiệu quả áp dụng của sáng kiến trên toàn huyện",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "",
    loaiBan: "Photo",
    ghiChu: "Photo (đã lưu vào Tl_loại_VP_Toàn_PL.xlsx)",
  },
  {
    soTT: "2",
    soKyHieuVanBan: "103/UBND",
    ngayThangVanBan: "03/11/2022",
    tenLoaiTrichYeu: "Công văn về việc đăng ký viết báo cáo sáng kiến, kinh nghiệm năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "",
    loaiBan: "Bản chính",
    ghiChu: "Trùng hs PL_2022_22S (đã lưu vào Tl_loại_VP_Toàn_PL.xlsx)",
  },
];

job.reviewStatus = "reviewed";
job.reviewedAt = new Date().toISOString();
job.updatedAt = new Date().toISOString();

// Ghi lại job.json
fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
console.log('Saved updated job.json successfully');

// 5. Xuất Excel ra thư mục Da_check của người dùng
const daCheckPath = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check/PL_2022_22S.xlsx';
const exportResult1 = await exportJsonToExcel(job, daCheckPath);
console.log('Exported to Da_check:', exportResult1);

// 6. Xuất Excel cập nhật vào thư mục PL_outputOCR
const ocrExcelPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2022_22S.xlsx';
try {
  const exportResult2 = await exportJsonToExcel(job, ocrExcelPath);
  console.log('Exported to PL_outputOCR:', exportResult2);
} catch (e) {
  console.warn('Could not overwrite PL_outputOCR/PL_2022_22S.xlsx (maybe open in Excel):', e.message);
  const fallbackPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2022_22S_updated.xlsx';
  const exportResult2 = await exportJsonToExcel(job, fallbackPath);
  console.log('Exported fallback to PL_outputOCR:', exportResult2);
}
