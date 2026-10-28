import fs from 'fs';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const jobPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2022_22Q.job.json';
const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

// 1. Cập nhật thông tin cấp hồ sơ
job.data.donViCapTren = "Ủy ban nhân dân huyện Tân Phú";
job.data.donVi = "Ủy ban nhân dân xã Phú Lộc";
job.data.soKyHieuHoSo = "PL_2022_22Q";
job.data.tenHoSo = "Hồ sơ về công tác đạo đức công vụ năm 2022 của UBND xã Phú Lộc";
job.data.tieuDeNghiQuyet = "Hồ sơ về công tác đạo đức công vụ năm 2022 của UBND xã Phú Lộc";
job.data.namGiaiDoan = "2022";
job.data.thoiGianHoSo = "Từ ngày 20/01/2022 đến ngày 09/09/2022";
job.data.tongSoToText = "Bản mục lục này gồm 34 văn bản, 65 tờ";
job.data.thbq = "Vĩnh viễn";
job.data.banTo = "Văn phòng";
job.data.tapSo = "01";

// 2. Danh sách 37 hàng tương ứng 37 ảnh chụp
const rowData = [
  // 001.jpg - Ảnh bìa ghi chú "67 PL-2022_22Q Đạo đức công vụ Năm 2022 - 65 tờ"
  {
    fileName: "001.jpg",
    isExcluded: true,
    soTT: "1",
    soKyHieuVanBan: "",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Đạo đức công vụ năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "01",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 002.jpg - Kế hoạch 06/KH-UBND (tập dày có ghim bấm, tờ 01-12)
  {
    fileName: "002.jpg",
    isExcluded: false,
    soTT: "1",
    soKyHieuVanBan: "06/KH-UBND",
    ngayThangVanBan: "20/01/2022",
    tenLoaiTrichYeu: "Kế hoạch thực hiện năm “Kỷ cương hành chính, đạo đức công vụ” trong thi hành nhiệm vụ của cán bộ, công chức xã Phú Lộc",
    tacGiaVanBan: "Ủy ban nhân dân xã Phú Lộc",
    toSoTrangSo: "01-12",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 003.jpg - Biên bản kiểm tra 24/01/2022
  {
    fileName: "003.jpg",
    isExcluded: false,
    soTT: "2",
    soKyHieuVanBan: "",
    ngayThangVanBan: "24/01/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "13",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 004.jpg - Biên bản kiểm tra 24/01/2022
  {
    fileName: "004.jpg",
    isExcluded: false,
    soTT: "3",
    soKyHieuVanBan: "",
    ngayThangVanBan: "24/01/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "14",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 005.jpg - Biên bản kiểm tra 24/01/2022
  {
    fileName: "005.jpg",
    isExcluded: false,
    soTT: "4",
    soKyHieuVanBan: "",
    ngayThangVanBan: "24/01/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "15",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 006.jpg - Biên bản kiểm tra 14/02/2022
  {
    fileName: "006.jpg",
    isExcluded: false,
    soTT: "5",
    soKyHieuVanBan: "",
    ngayThangVanBan: "14/02/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "16",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 007.jpg - Biên bản kiểm tra 14/02/2022
  {
    fileName: "007.jpg",
    isExcluded: false,
    soTT: "6",
    soKyHieuVanBan: "",
    ngayThangVanBan: "14/02/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "17",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 008.jpg - Biên bản kiểm tra 14/02/2022
  {
    fileName: "008.jpg",
    isExcluded: false,
    soTT: "7",
    soKyHieuVanBan: "",
    ngayThangVanBan: "14/02/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "18",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 009.jpg - Biên bản kiểm tra 14/02/2022
  {
    fileName: "009.jpg",
    isExcluded: false,
    soTT: "8",
    soKyHieuVanBan: "",
    ngayThangVanBan: "14/02/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "19",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 010.jpg - Biên bản kiểm tra 04/03/2022
  {
    fileName: "010.jpg",
    isExcluded: false,
    soTT: "9",
    soKyHieuVanBan: "",
    ngayThangVanBan: "04/03/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "20",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 011.jpg - Biên bản kiểm tra 04/03/2022
  {
    fileName: "011.jpg",
    isExcluded: false,
    soTT: "10",
    soKyHieuVanBan: "",
    ngayThangVanBan: "04/03/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "21",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 012.jpg - Biên bản kiểm tra 04/03/2022
  {
    fileName: "012.jpg",
    isExcluded: false,
    soTT: "11",
    soKyHieuVanBan: "",
    ngayThangVanBan: "04/03/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "22",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 013.jpg - Biên bản kiểm tra 04/03/2022
  {
    fileName: "013.jpg",
    isExcluded: false,
    soTT: "12",
    soKyHieuVanBan: "",
    ngayThangVanBan: "04/03/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "23",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 014.jpg - Biên bản kiểm tra 11/08/2022
  {
    fileName: "014.jpg",
    isExcluded: false,
    soTT: "13",
    soKyHieuVanBan: "",
    ngayThangVanBan: "11/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "24",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 015.jpg - Biên bản kiểm tra 11/08/2022
  {
    fileName: "015.jpg",
    isExcluded: false,
    soTT: "14",
    soKyHieuVanBan: "",
    ngayThangVanBan: "11/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "25",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 016.jpg - Biên bản kiểm tra 11/08/2022
  {
    fileName: "016.jpg",
    isExcluded: false,
    soTT: "15",
    soKyHieuVanBan: "",
    ngayThangVanBan: "11/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "26",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 017.jpg - Biên bản kiểm tra 11/08/2022
  {
    fileName: "017.jpg",
    isExcluded: false,
    soTT: "16",
    soKyHieuVanBan: "",
    ngayThangVanBan: "11/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "27",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 018.jpg - Biên bản kiểm tra 11/08/2022
  {
    fileName: "018.jpg",
    isExcluded: false,
    soTT: "17",
    soKyHieuVanBan: "",
    ngayThangVanBan: "11/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "28",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 019.jpg - Biên bản kiểm tra 11/08/2022
  {
    fileName: "019.jpg",
    isExcluded: false,
    soTT: "18",
    soKyHieuVanBan: "",
    ngayThangVanBan: "11/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "29",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 020.jpg - Biên bản kiểm tra 11/08/2022
  {
    fileName: "020.jpg",
    isExcluded: false,
    soTT: "19",
    soKyHieuVanBan: "",
    ngayThangVanBan: "11/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "30",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 021.jpg - Biên bản kiểm tra 11/08/2022
  {
    fileName: "021.jpg",
    isExcluded: false,
    soTT: "20",
    soKyHieuVanBan: "",
    ngayThangVanBan: "11/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "31",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 022.jpg - Biên bản kiểm tra 11/08/2022
  {
    fileName: "022.jpg",
    isExcluded: false,
    soTT: "21",
    soKyHieuVanBan: "",
    ngayThangVanBan: "11/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "32",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 023.jpg - Biên bản kiểm tra 11/08/2022
  {
    fileName: "023.jpg",
    isExcluded: false,
    soTT: "22",
    soKyHieuVanBan: "",
    ngayThangVanBan: "11/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "33",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 024.jpg - Biên bản kiểm tra 19/08/2022
  {
    fileName: "024.jpg",
    isExcluded: false,
    soTT: "23",
    soKyHieuVanBan: "",
    ngayThangVanBan: "19/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "34",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 025.jpg - Biên bản kiểm tra 19/08/2022
  {
    fileName: "025.jpg",
    isExcluded: false,
    soTT: "24",
    soKyHieuVanBan: "",
    ngayThangVanBan: "19/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "35",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 026.jpg - Biên bản kiểm tra 19/08/2022
  {
    fileName: "026.jpg",
    isExcluded: false,
    soTT: "25",
    soKyHieuVanBan: "",
    ngayThangVanBan: "19/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "36",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 027.jpg - Biên bản kiểm tra 19/08/2022
  {
    fileName: "027.jpg",
    isExcluded: false,
    soTT: "26",
    soKyHieuVanBan: "",
    ngayThangVanBan: "19/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "37",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 028.jpg - Biên bản kiểm tra 19/08/2022
  {
    fileName: "028.jpg",
    isExcluded: false,
    soTT: "27",
    soKyHieuVanBan: "",
    ngayThangVanBan: "19/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "38",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 029.jpg - Biên bản kiểm tra 19/08/2022
  {
    fileName: "029.jpg",
    isExcluded: false,
    soTT: "28",
    soKyHieuVanBan: "",
    ngayThangVanBan: "19/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "39",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 030.jpg - Biên bản kiểm tra 19/08/2022
  {
    fileName: "030.jpg",
    isExcluded: false,
    soTT: "29",
    soKyHieuVanBan: "",
    ngayThangVanBan: "19/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "40",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 031.jpg - Biên bản kiểm tra 19/08/2022
  {
    fileName: "031.jpg",
    isExcluded: false,
    soTT: "30",
    soKyHieuVanBan: "",
    ngayThangVanBan: "19/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "41",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 032.jpg - Biên bản kiểm tra 19/08/2022
  {
    fileName: "032.jpg",
    isExcluded: false,
    soTT: "31",
    soKyHieuVanBan: "",
    ngayThangVanBan: "19/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "42",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 033.jpg - Biên bản kiểm tra 19/08/2022
  {
    fileName: "033.jpg",
    isExcluded: false,
    soTT: "32",
    soKyHieuVanBan: "",
    ngayThangVanBan: "19/08/2022",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "43",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 034.jpg - Báo cáo 135/BC-TKT ngày 09/09/2022
  {
    fileName: "034.jpg",
    isExcluded: false,
    soTT: "33",
    soKyHieuVanBan: "135/BC-TKT",
    ngayThangVanBan: "09/09/2022",
    tenLoaiTrichYeu: "Báo cáo kết quả kiểm tra thi hành công vụ đối với cán bộ, công chức xã Phú Lộc",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "44",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 035.jpg - Biên bản kiểm tra (mẫu đính kèm, có ghim bấm, tờ 45-65)
  {
    fileName: "035.jpg",
    isExcluded: false,
    soTT: "34",
    soKyHieuVanBan: "",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "45-65",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 036.jpg - Ảnh chụp lặp lại tờ 45 (skip)
  {
    fileName: "036.jpg",
    isExcluded: true,
    soTT: "34",
    soKyHieuVanBan: "",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "45",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 037.jpg - Tờ chốt cuối của tài liệu 45-65 có ghim bấm (skip)
  {
    fileName: "037.jpg",
    isExcluded: true,
    soTT: "34",
    soKyHieuVanBan: "",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Biên bản kiểm tra",
    tacGiaVanBan: "UBND xã Phú Lộc - Tổ kiểm tra công vụ",
    toSoTrangSo: "65",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
];

// Cập nhật mảng images và rows đồng bộ 1-1
job.images = rowData.map((r, i) => ({
  fileName: r.fileName,
  status: r.isExcluded ? "skip" : "ok",
  rowIndexes: [i],
  error: null,
}));

job.data.rows = rowData.map(r => ({
  isExcluded: r.isExcluded,
  soTT: r.soTT,
  soKyHieuVanBan: r.soKyHieuVanBan,
  ngayThangVanBan: r.ngayThangVanBan,
  tenLoaiTrichYeu: r.tenLoaiTrichYeu,
  tacGiaVanBan: r.tacGiaVanBan,
  toSoTrangSo: r.toSoTrangSo,
  loaiBan: r.loaiBan,
  ghiChu: r.ghiChu || "",
}));

job.data.rowsTrung = [];

job.reviewStatus = "reviewed";
job.reviewedAt = new Date().toISOString();
job.updatedAt = new Date().toISOString();

// Ghi đè file job.json
fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
console.log('Saved updated PL_2022_22Q.job.json successfully');

// Xuất file Excel ra Da_check
const daCheckPath = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check/PL_2022_22Q.xlsx';
const res1 = await exportJsonToExcel(job, daCheckPath);
console.log('Exported to Da_check:', res1);

// Xuất file Excel ra PL_outputOCR
const ocrExcelPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2022_22Q.xlsx';
try {
  const res2 = await exportJsonToExcel(job, ocrExcelPath);
  console.log('Exported to PL_outputOCR:', res2);
} catch (e) {
  console.warn('Could not overwrite PL_outputOCR/PL_2022_22Q.xlsx:', e.message);
}
