import fs from 'fs';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const jobPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2022_22R.job.json';
const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

// 1. Cập nhật thông tin cấp hồ sơ
job.data.donViCapTren = "Ủy ban nhân dân huyện Tân Phú";
job.data.donVi = "Ủy ban nhân dân xã Phú Lộc";
job.data.soKyHieuHoSo = "PL_2022_22R";
job.data.tenHoSo = "Hồ sơ về việc đánh giá chính quyền cơ sở năm 2022 của UBND xã Phú Lộc";
job.data.tieuDeNghiQuyet = "Hồ sơ về việc đánh giá chính quyền cơ sở năm 2022 của UBND xã Phú Lộc";
job.data.namGiaiDoan = "2022";
job.data.thoiGianHoSo = "Từ ngày 06/09/2021 đến ngày 14/11/2022";
job.data.tongSoToText = "Bản mục lục này gồm 43 văn bản, 120 tờ";
job.data.thbq = "Vĩnh viễn";
job.data.banTo = "Văn phòng";
job.data.tapSo = "01";

// 2. Danh sách 45 hàng dữ liệu tương ứng 45 ảnh
const rowData = [
  // 001.jpg - Ảnh bìa ghi chú "Chính quyền CS 2022 Phú Lộc"
  {
    fileName: "001.jpg",
    isExcluded: true,
    soTT: "1",
    soKyHieuVanBan: "03/KH-CAX",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Kế hoạch tuần tra kiểm soát sau 23h đêm",
    tacGiaVanBan: "Công an xã Phú Lộc",
    toSoTrangSo: "01",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 002.jpg - Kế hoạch 03/KH-CAX
  {
    fileName: "002.jpg",
    isExcluded: false,
    soTT: "1",
    soKyHieuVanBan: "03/KH-CAX",
    ngayThangVanBan: "01/01/2022",
    tenLoaiTrichYeu: "Kế hoạch tuần tra kiểm soát sau 23 giờ đêm (từ ngày 01/01/2022 đến ngày 31/12/2022)",
    tacGiaVanBan: "Công an huyện Tân Phú - Công an xã Phú Lộc",
    toSoTrangSo: "01-02",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 003.jpg - Kế hoạch 04/KH-BCĐ
  {
    fileName: "003.jpg",
    isExcluded: false,
    soTT: "2",
    soKyHieuVanBan: "04/KH-BCĐ",
    ngayThangVanBan: "06/01/2022",
    tenLoaiTrichYeu: "Kế hoạch thực hiện công tác đảm bảo an toàn PCCC và cứu nạn, cứu hộ trên địa bàn xã Phú Lộc năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc - Ban Chỉ đạo PCCC & CNCH",
    toSoTrangSo: "03-05",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 004.jpg - Kế hoạch 07/KH-UBND
  {
    fileName: "004.jpg",
    isExcluded: false,
    soTT: "3",
    soKyHieuVanBan: "07/KH-UBND",
    ngayThangVanBan: "07/01/2022",
    tenLoaiTrichYeu: "Kế hoạch hoạt động của Trang thông tin điện tử xã Phú Lộc năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "06",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 005.jpg - Kế hoạch 03/KH-UBND
  {
    fileName: "005.jpg",
    isExcluded: false,
    soTT: "4",
    soKyHieuVanBan: "03/KH-UBND",
    ngayThangVanBan: "14/01/2022",
    tenLoaiTrichYeu: "Kế hoạch xây dựng đường GTNT năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "07-08",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 006.jpg - Bảng tổng hợp quyết toán thu ngân sách
  {
    fileName: "006.jpg",
    isExcluded: false,
    soTT: "5",
    soKyHieuVanBan: "",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Tổng hợp quyết toán thu ngân sách xã từ ngày 01/01/2022 đến ngày 30/11/2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "09-21",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 007.jpg - Kế hoạch 16/KH-UBND
  {
    fileName: "007.jpg",
    isExcluded: false,
    soTT: "6",
    soKyHieuVanBan: "16/KH-UBND",
    ngayThangVanBan: "08/02/2022",
    tenLoaiTrichYeu: "Kế hoạch công tác phổ biến, giáo dục pháp luật; hòa giải ở cơ sở; xây dựng cấp xã đạt chuẩn tiếp cận pháp luật năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "22-23",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 008.jpg - Kế hoạch 25/KH-UBND
  {
    fileName: "008.jpg",
    isExcluded: false,
    soTT: "7",
    soKyHieuVanBan: "25/KH-UBND",
    ngayThangVanBan: "09/02/2022",
    tenLoaiTrichYeu: "Kế hoạch sản xuất nông nghiệp, lâm nghiệp, thủy sản trên địa bàn xã Phú Lộc năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "24",
    loaiBan: "Bản gốc không mộc",
    ghiChu: "",
  },
  // 009.jpg - Kế hoạch 34/KH-UBND
  {
    fileName: "009.jpg",
    isExcluded: false,
    soTT: "8",
    soKyHieuVanBan: "34/KH-UBND",
    ngayThangVanBan: "08/03/2022",
    tenLoaiTrichYeu: "Kế hoạch kiểm tra trật tự xây dựng trên địa bàn xã Phú Lộc năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "25",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 010.jpg - Kế hoạch 41/KH-UBND
  {
    fileName: "010.jpg",
    isExcluded: false,
    soTT: "9",
    soKyHieuVanBan: "41/KH-UBND",
    ngayThangVanBan: "01/04/2022",
    tenLoaiTrichYeu: "Kế hoạch thực hiện Quy chế dân chủ năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "26-27",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 011.jpg - Biên bản họp dân
  {
    fileName: "011.jpg",
    isExcluded: false,
    soTT: "10",
    soKyHieuVanBan: "",
    ngayThangVanBan: "12/08/2022",
    tenLoaiTrichYeu: "Biên bản họp về việc họp dân đóng góp làm đường GTNT bê tông hóa đường 500KV (Tà Lài đến Mười Đưa) ấp 1",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "28-30",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 012.jpg - Quyết định 637/QĐ-UBND
  {
    fileName: "012.jpg",
    isExcluded: false,
    soTT: "11",
    soKyHieuVanBan: "637/QĐ-UBND",
    ngayThangVanBan: "06/09/2021",
    tenLoaiTrichYeu: "Quyết định về việc ban hành Nội quy cơ quan",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "31-35",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 013.jpg - Quyết định 567/QĐ-UBND
  {
    fileName: "013.jpg",
    isExcluded: false,
    soTT: "12",
    soKyHieuVanBan: "567/QĐ-UBND",
    ngayThangVanBan: "10/09/2021",
    tenLoaiTrichYeu: "Quyết định về việc ban hành Quy chế tiếp công dân của Chủ tịch UBND xã Phú Lộc",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "36-38",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 014.jpg - Công văn 5344/UBND-NC
  {
    fileName: "014.jpg",
    isExcluded: false,
    soTT: "13",
    soKyHieuVanBan: "5344/UBND-NC",
    ngayThangVanBan: "31/10/2022",
    tenLoaiTrichYeu: "Công văn về việc thực hiện đánh giá chính quyền cơ sở năm 2022",
    tacGiaVanBan: "UBND huyện Tân Phú",
    toSoTrangSo: "39-40",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 015.jpg - Báo cáo 169/BC-UBND
  {
    fileName: "015.jpg",
    isExcluded: false,
    soTT: "14",
    soKyHieuVanBan: "169/BC-UBND",
    ngayThangVanBan: "05/11/2022",
    tenLoaiTrichYeu: "Báo cáo kết quả thực hiện quy chế dân chủ ở cơ sở năm 2022 và nhiệm vụ, giải pháp năm 2023",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "41-43",
    loaiBan: "Bản gốc không mộc",
    ghiChu: "",
  },
  // 016.jpg - Báo cáo 185/BC-UBND
  {
    fileName: "016.jpg",
    isExcluded: false,
    soTT: "15",
    soKyHieuVanBan: "185/BC-UBND",
    ngayThangVanBan: "11/11/2022",
    tenLoaiTrichYeu: "Báo cáo công tác cấp, phát giấy CNQSDĐ quyền sở hữu nhà ở và tài sản gắn liền với đất, quản lý đất công đầu năm 2022 và phương hướng nhiệm vụ năm 2023 trên địa bàn xã",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "44-45",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 017.jpg - Báo cáo 180/BC-UBND
  {
    fileName: "017.jpg",
    isExcluded: false,
    soTT: "16",
    soKyHieuVanBan: "180/BC-UBND",
    ngayThangVanBan: "11/11/2022",
    tenLoaiTrichYeu: "Báo cáo công tác tuyên truyền phổ biến giáo dục pháp luật năm 2022 của UBND xã Phú Lộc",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "46-47",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 018.jpg - Chỉ tiêu Đảng ủy
  {
    fileName: "018.jpg",
    isExcluded: false,
    soTT: "17",
    soKyHieuVanBan: "",
    ngayThangVanBan: "14/11/2022",
    tenLoaiTrichYeu: "Các chỉ tiêu chủ yếu về phát triển kinh tế - xã hội, an ninh quốc phòng, xây dựng đảng, đoàn thể năm 2022",
    tacGiaVanBan: "Đảng bộ huyện Tân Phú - Đảng ủy xã Phú Lộc",
    toSoTrangSo: "48-49",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 019.jpg - Kế hoạch 05/KH-CAX
  {
    fileName: "019.jpg",
    isExcluded: false,
    soTT: "18",
    soKyHieuVanBan: "05/KH-CAX",
    ngayThangVanBan: "09/01/2022",
    tenLoaiTrichYeu: "Kế hoạch tổng kiểm tra hành chính nhân hộ khẩu trên địa bàn xã Phú Lộc",
    tacGiaVanBan: "Công an huyện Tân Phú - Công an xã Phú Lộc",
    toSoTrangSo: "50",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 020.jpg - Kế hoạch 12/KH-CAX
  {
    fileName: "020.jpg",
    isExcluded: false,
    soTT: "19",
    soKyHieuVanBan: "12/KH-CAX",
    ngayThangVanBan: "12/01/2022",
    tenLoaiTrichYeu: "Kế hoạch bảo đảm trật tự, an toàn giao thông, trật tự xã hội trong hoạt động vận tải hành khách thích ứng an toàn, linh hoạt, kiểm soát chặt chẽ dịch Covid-19 của lực lượng Công an nhân dân",
    tacGiaVanBan: "Công an huyện Tân Phú - Công an xã Phú Lộc",
    toSoTrangSo: "51-52",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 021.jpg - Kế hoạch 15/KH-CAX
  {
    fileName: "021.jpg",
    isExcluded: false,
    soTT: "20",
    soKyHieuVanBan: "15/KH-CAX",
    ngayThangVanBan: "17/01/2022",
    tenLoaiTrichYeu: "Kế hoạch tổ chức kiểm tra hành chính các cơ sở ngành nghề kinh doanh có điều kiện về ANTT",
    tacGiaVanBan: "Công an huyện Tân Phú - Công an xã Phú Lộc",
    toSoTrangSo: "53",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 022.jpg - Chương trình 01/CTr-UBND
  {
    fileName: "022.jpg",
    isExcluded: false,
    soTT: "21",
    soKyHieuVanBan: "01/CTr-UBND",
    ngayThangVanBan: "24/01/2022",
    tenLoaiTrichYeu: "Chương trình công tác của UBND xã Phú Lộc năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "54-56",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 023.jpg - Quyết định 273/QĐ-UBND
  {
    fileName: "023.jpg",
    isExcluded: false,
    soTT: "22",
    soKyHieuVanBan: "273/QĐ-UBND",
    ngayThangVanBan: "25/01/2022",
    tenLoaiTrichYeu: "Quyết định về việc giao chỉ tiêu kế hoạch phát triển kinh tế - xã hội và phân bổ dự toán ngân sách nhà nước năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "57-61",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 024.jpg - Phương án 01/PA-PCCC
  {
    fileName: "024.jpg",
    isExcluded: false,
    soTT: "23",
    soKyHieuVanBan: "01/PA-PCCC",
    ngayThangVanBan: "08/02/2022",
    tenLoaiTrichYeu: "Phương án phòng cháy chữa cháy",
    tacGiaVanBan: "UBND xã Phú Lộc - Ban Chỉ đạo PCCC & CNCH",
    toSoTrangSo: "62-63",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 025.jpg - Kế hoạch 13/KH-UBND (Bản 1)
  {
    fileName: "025.jpg",
    isExcluded: false,
    soTT: "24",
    soKyHieuVanBan: "13/KH-UBND",
    ngayThangVanBan: "08/02/2022",
    tenLoaiTrichYeu: "Kế hoạch về việc phát động phong trào thi đua thực hiện thắng lợi nhiệm vụ phát triển kinh tế - xã hội, quốc phòng - an ninh năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "64-65",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 026.jpg - Kế hoạch 13/KH-UBND (Bản 2)
  {
    fileName: "026.jpg",
    isExcluded: false,
    soTT: "25",
    soKyHieuVanBan: "13/KH-UBND",
    ngayThangVanBan: "08/02/2022",
    tenLoaiTrichYeu: "Kế hoạch về việc phát động phong trào thi đua thực hiện thắng lợi nhiệm vụ phát triển kinh tế - xã hội, quốc phòng - an ninh năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "66-67",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 027.jpg - Kế hoạch 17/KH-UBND
  {
    fileName: "027.jpg",
    isExcluded: false,
    soTT: "26",
    soKyHieuVanBan: "17/KH-UBND",
    ngayThangVanBan: "08/02/2022",
    tenLoaiTrichYeu: "Kế hoạch thực hiện công tác tiếp dân, giải quyết đơn thư khiếu nại, tố cáo năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "68-69",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 028.jpg - Kế hoạch 22/KH-UBND
  {
    fileName: "028.jpg",
    isExcluded: false,
    soTT: "27",
    soKyHieuVanBan: "22/KH-UBND",
    ngayThangVanBan: "08/02/2022",
    tenLoaiTrichYeu: "Kế hoạch đào tạo, bồi dưỡng, nâng cao năng lực đội ngũ cán bộ làm công tác dân số các cấp giai đoạn 2021 - 2030 trên địa bàn xã Phú Lộc",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "70-71",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 029.jpg - Kế hoạch 40/KH-UBND
  {
    fileName: "029.jpg",
    isExcluded: false,
    soTT: "28",
    soKyHieuVanBan: "40/KH-UBND",
    ngayThangVanBan: "01/03/2022",
    tenLoaiTrichYeu: "Kế hoạch phát triển chính quyền số và bảo đảm an toàn thông tin mạng trên địa bàn xã Phú Lộc năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "72-78",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 030.jpg - Báo cáo 65/BC-UBND
  {
    fileName: "030.jpg",
    isExcluded: false,
    soTT: "29",
    soKyHieuVanBan: "65/BC-UBND",
    ngayThangVanBan: "25/05/2022",
    tenLoaiTrichYeu: "Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP 6 tháng đầu năm 2022 phương hướng nhiệm vụ 6 tháng cuối năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "79-85",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
  // 031.jpg - Báo cáo 71/BC-UBND
  {
    fileName: "031.jpg",
    isExcluded: false,
    soTT: "30",
    soKyHieuVanBan: "71/BC-UBND",
    ngayThangVanBan: "30/05/2022",
    tenLoaiTrichYeu: "Báo cáo kết quả thực hiện quy chế dân chủ ở cơ sở 6 tháng đầu năm 2022 và nhiệm vụ, giải pháp 6 tháng cuối năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "86-88",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 032.jpg - Báo cáo 72/BC-UBND
  {
    fileName: "032.jpg",
    isExcluded: false,
    soTT: "31",
    soKyHieuVanBan: "72/BC-UBND",
    ngayThangVanBan: "30/05/2022",
    tenLoaiTrichYeu: "Báo cáo kết quả thực hiện công tác dân vận chính quyền 6 tháng đầu năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "89-91",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 033.jpg - Báo cáo 82/BC-UBND
  {
    fileName: "033.jpg",
    isExcluded: false,
    soTT: "32",
    soKyHieuVanBan: "82/BC-UBND",
    ngayThangVanBan: "08/06/2022",
    tenLoaiTrichYeu: "Báo cáo kết quả thực hiện cơ chế một cửa, một cửa liên thông, kiểm soát thủ tục hành chính 6 tháng đầu năm 2022, phương hướng thực hiện nhiệm vụ 6 tháng cuối năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "92-93",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 034.jpg - Báo cáo 86/BC-UBND
  {
    fileName: "034.jpg",
    isExcluded: false,
    soTT: "33",
    soKyHieuVanBan: "86/BC-UBND",
    ngayThangVanBan: "10/06/2022",
    tenLoaiTrichYeu: "Báo cáo kết quả thực hiện công tác phòng, chống tham nhũng 6 tháng đầu năm 2022 và phương hướng, nhiệm vụ 6 tháng cuối năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "94-96",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 035.jpg - Báo cáo 87/BC-UBND
  {
    fileName: "035.jpg",
    isExcluded: false,
    soTT: "34",
    soKyHieuVanBan: "87/BC-UBND",
    ngayThangVanBan: "10/06/2022",
    tenLoaiTrichYeu: "Báo cáo kiểm điểm sự chỉ đạo, điều hành của UBND xã 6 tháng đầu năm 2022 và chương trình công tác trọng tâm 6 tháng cuối năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "97-99",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 036.jpg - Thông báo 36-TB/ĐU
  {
    fileName: "036.jpg",
    isExcluded: false,
    soTT: "35",
    soKyHieuVanBan: "36-TB/ĐU",
    ngayThangVanBan: "23/08/2022",
    tenLoaiTrichYeu: "Thông báo về thời gian, địa điểm đối thoại trực tiếp với nhân dân của Đồng chí Bí Thư Đảng Ủy, Đồng chí Chủ Tịch Ủy Ban Nhân Dân Xã",
    tacGiaVanBan: "Đảng bộ huyện Tân Phú - Đảng ủy xã Phú Lộc",
    toSoTrangSo: "100",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 037.jpg - Thông báo 74/TB-UBND
  {
    fileName: "037.jpg",
    isExcluded: false,
    soTT: "36",
    soKyHieuVanBan: "74/TB-UBND",
    ngayThangVanBan: "22/09/2022",
    tenLoaiTrichYeu: "Thông báo công khai đường dây nóng và hộp thư điện tử của UBND xã Phú Lộc để tiếp nhận, xử lý thông tin phản ánh, khiếu nại, tố cáo về hành vi nhũng nhiễu gây phiền hà đối với người dân, doanh nghiệp",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "101-102",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 038.jpg - Quyết định 914/QĐ-UBND
  {
    fileName: "038.jpg",
    isExcluded: false,
    soTT: "37",
    soKyHieuVanBan: "914/QĐ-UBND",
    ngayThangVanBan: "04/10/2022",
    tenLoaiTrichYeu: "Quyết định về việc củng cố Điểm tư vấn, hỗ trợ điều trị nghiện ma túy tại cộng đồng",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "103",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 039.jpg - Ảnh chụp lại của tờ 103 (trùng ảnh với 038.jpg)
  {
    fileName: "039.jpg",
    isExcluded: true,
    soTT: "38",
    soKyHieuVanBan: "914/QĐ-UBND",
    ngayThangVanBan: "04/10/2022",
    tenLoaiTrichYeu: "Quyết định về việc củng cố Điểm tư vấn, hỗ trợ điều trị nghiện ma túy tại cộng đồng",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "103",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 040.jpg - Báo cáo 157/BC-UBND
  {
    fileName: "040.jpg",
    isExcluded: false,
    soTT: "38",
    soKyHieuVanBan: "157/BC-UBND",
    ngayThangVanBan: "19/10/2022",
    tenLoaiTrichYeu: "Báo cáo tình hình thực hiện nhiệm vụ phát triển KTXH-ANQP năm 2022 và phương hướng nhiệm vụ năm 2023",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "104-112",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 041.jpg - Báo cáo 163/BC-UBND
  {
    fileName: "041.jpg",
    isExcluded: false,
    soTT: "39",
    soKyHieuVanBan: "163/BC-UBND",
    ngayThangVanBan: "27/10/2022",
    tenLoaiTrichYeu: "Báo cáo về kết quả họp nhân dân vận động hiến đất mở rộng đường Phú Lộc - Phú Tân",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "113",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 042.jpg - Báo cáo 172/BC-UBND
  {
    fileName: "042.jpg",
    isExcluded: false,
    soTT: "40",
    soKyHieuVanBan: "172/BC-UBND",
    ngayThangVanBan: "05/11/2022",
    tenLoaiTrichYeu: "Báo cáo kết quả tình hình thi hành pháp luật lĩnh vực trọng tâm năm 2022 trên địa bàn xã Phú Lộc",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "114-115",
    loaiBan: "Photo",
    ghiChu: "",
  },
  // 043.jpg - Báo cáo 182/BC-UBND
  {
    fileName: "043.jpg",
    isExcluded: false,
    soTT: "41",
    soKyHieuVanBan: "182/BC-UBND",
    ngayThangVanBan: "11/11/2022",
    tenLoaiTrichYeu: "Báo cáo kết quả thực hiện chương trình giảm nghèo năm 2022 và phương hướng nhiệm vụ năm 2023",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "116-118",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 044.jpg - Báo cáo 183/BC-UBND
  {
    fileName: "044.jpg",
    isExcluded: false,
    soTT: "42",
    soKyHieuVanBan: "183/BC-UBND",
    ngayThangVanBan: "11/11/2022",
    tenLoaiTrichYeu: "Báo cáo tình hình thực hiện công tác Hộ tịch; Công tác tiếp dân; Giải quyết đơn thư, khiếu nại - tố cáo năm 2022",
    tacGiaVanBan: "UBND xã Phú Lộc",
    toSoTrangSo: "119",
    loaiBan: "Bản chính",
    ghiChu: "",
  },
  // 045.jpg - Kế hoạch phối hợp
  {
    fileName: "045.jpg",
    isExcluded: false,
    soTT: "43",
    soKyHieuVanBan: "",
    ngayThangVanBan: "",
    tenLoaiTrichYeu: "Kế hoạch phối hợp công tác giữa UBND xã và Hội Nông dân xã giai đoạn 2021-2026",
    tacGiaVanBan: "UBND xã Phú Lộc - Hội Nông dân",
    toSoTrangSo: "120",
    loaiBan: "Bản gốc",
    ghiChu: "",
  },
];

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

// Ghi lại job.json
fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
console.log('Saved updated job.json successfully');

// Xuất file Excel ra Da_check
const daCheckPath = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check/PL_2022_22R.xlsx';
const res1 = await exportJsonToExcel(job, daCheckPath);
console.log('Exported to Da_check:', res1);

// Xuất file Excel ra PL_outputOCR
const ocrExcelPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2022_22R.xlsx';
try {
  const res2 = await exportJsonToExcel(job, ocrExcelPath);
  console.log('Exported to PL_outputOCR:', res2);
} catch (e) {
  console.warn('Could not overwrite PL_outputOCR/PL_2022_22R.xlsx:', e.message);
  const fallbackPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2022_22R_updated.xlsx';
  const res2 = await exportJsonToExcel(job, fallbackPath);
  console.log('Exported fallback to PL_outputOCR:', res2);
}
