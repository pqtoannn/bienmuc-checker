import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function process19W() {
  const dosId = 'PL_2019_19W';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ khen thưởng năm 2019 xã Phú Lộc';
  job.data.tieuDeNghiQuyet = 'Hồ sơ khen thưởng năm 2019 xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = '2019';
  job.data.tongSoToText = '';

  // Mark 001.jpg as skip (scrap note)
  if (job.images && job.images[0]) {
    job.images[0].status = 'skip';
    job.images[0].isExcluded = true;
    job.images[0].skipReason = 'Tờ giấy nháp ghi chú đầu hồ sơ';
  }

  const rawRows = [
    {
      source: '002.jpg',
      soKyHieu: '',
      ngayThang: '15/01/2019',
      trichYeu: 'Báo cáo thành tích đề nghị UBND xã tặng thưởng Giấy khen gương người tốt việc tốt năm 2018',
      tacGia: 'Nguyễn Thị Thu Phương',
      toSo: '01-02',
      loaiBan: 'Bản gốc không mộc'
    },
    {
      source: '003.jpg',
      soKyHieu: '01/QĐ-UBND',
      ngayThang: '18/01/2019',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các cá nhân có thành tích xuất sắc trong phong trào gương "Người tốt, việc tốt" năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '03-07',
      loaiBan: 'Bản gốc'
    },
    {
      source: '004.jpg',
      soKyHieu: '',
      ngayThang: '18/01/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2018',
      tacGia: 'Hội Đồng Nhân Dân Xã Phú Lộc',
      toSo: '08-11',
      loaiBan: 'Bản gốc'
    },
    {
      source: '005.jpg',
      soKyHieu: '',
      ngayThang: '18/01/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2018',
      tacGia: 'Hội đồng nhân dân xã Phú Lộc',
      toSo: '12-13',
      loaiBan: 'Bản gốc'
    },
    {
      source: '006.jpg',
      soKyHieu: '',
      ngayThang: '20/01/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2018, ông Trần Văn Sang',
      tacGia: 'Trần Văn Sang',
      toSo: '14-15',
      loaiBan: 'Bản gốc'
    },
    {
      source: '007.jpg',
      soKyHieu: '',
      ngayThang: '25/01/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2018',
      tacGia: 'Hội đồng nhân dân xã Phú Lộc',
      toSo: '16-17',
      loaiBan: 'Bản gốc'
    },
    {
      source: '008.jpg',
      soKyHieu: '02/TTr-BCH',
      ngayThang: '04/03/2019',
      trichYeu: 'Tờ trình về việc đề nghị Hội đồng thi đua khen thưởng xã Phú Lộc xét khen thưởng tập thể, cá nhân và gia đình tiêu biểu có thành tích xuất sắc trong công tác gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ban Chỉ Huy Quân Sự Xã Phú Lộc',
      toSo: '18-19',
      loaiBan: 'Bản gốc'
    },
    {
      source: '009.jpg',
      soKyHieu: '',
      ngayThang: '10/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị Chủ tịch UBND xã khen thưởng trong công tác tuyển chọn, gọi công dân nhập ngũ năm 2019, đ/c Đặng Minh Phụng',
      tacGia: 'Đặng Minh Phụng',
      toSo: '20',
      loaiBan: 'Bản gốc'
    },
    {
      source: '010.jpg',
      soKyHieu: '',
      ngayThang: '11/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019, Trương Quốc Cương',
      tacGia: 'Trương Quốc Cương',
      toSo: '21-25',
      loaiBan: 'Bản gốc'
    },
    {
      source: '011.jpg',
      soKyHieu: '',
      ngayThang: '11/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị Chủ tịch UBND xã tặng bằng khen trong công tác tuyển quân năm 2019 của tập thể Ban chỉ huy quân sự xã Phú Lộc',
      tacGia: 'Ban CHQS Xã',
      toSo: '26-27',
      loaiBan: 'Bản gốc'
    },
    {
      source: '012.jpg',
      soKyHieu: '',
      ngayThang: '14/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị xã tặng giấy khen cá nhân năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '28-29',
      loaiBan: 'Bản gốc'
    },
    {
      source: '013.jpg',
      soKyHieu: '',
      ngayThang: '14/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị UBND xã tặng thưởng cho cá nhân có thành tích xuất sắc thực hiện công tác tuyển quân năm 2019, Nguyễn Thị Nghĩa',
      tacGia: 'Nguyễn Thị Nghĩa',
      toSo: '30-31',
      loaiBan: 'Bản gốc'
    },
    {
      source: '014.jpg',
      soKyHieu: '',
      ngayThang: '14/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ban Nhân Dân Ấp 1',
      toSo: '32',
      loaiBan: 'Bản gốc'
    },
    {
      source: '015.jpg',
      soKyHieu: '',
      ngayThang: '14/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'BND Ấp 1',
      toSo: '33',
      loaiBan: 'Bản gốc'
    },
    {
      source: '016.jpg',
      soKyHieu: '',
      ngayThang: '14/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '34',
      loaiBan: 'Bản gốc'
    },
    {
      source: '017.jpg',
      soKyHieu: '',
      ngayThang: '14/03/2019',
      trichYeu: 'Báo cáo thành tích cá nhân đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019, Võ Thị Thanh Thảo',
      tacGia: 'Võ Thị Thanh Thảo',
      toSo: '35-36',
      loaiBan: 'Bản gốc'
    },
    {
      source: '018.jpg',
      soKyHieu: '',
      ngayThang: '15/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'BND Ấp 1',
      toSo: '37',
      loaiBan: 'Bản gốc'
    },
    {
      source: '019.jpg',
      soKyHieu: '',
      ngayThang: '15/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019, Trần Văn Thi',
      tacGia: 'Trần Văn Thi',
      toSo: '38',
      loaiBan: 'Bản gốc'
    },
    {
      source: '020.jpg',
      soKyHieu: '',
      ngayThang: '15/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị xã tặng giấy khen cá nhân năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '39-40',
      loaiBan: 'Bản gốc'
    },
    {
      source: '021.jpg',
      soKyHieu: '',
      ngayThang: '15/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019, Trần Ngọc Thắng',
      tacGia: 'Trần Ngọc Thắng',
      toSo: '41',
      loaiBan: 'Bản gốc'
    },
    {
      source: '022.jpg',
      soKyHieu: '',
      ngayThang: '15/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ban Công An Xã Phú Lộc',
      toSo: '42',
      loaiBan: 'Bản gốc'
    },
    {
      source: '023.jpg',
      soKyHieu: '',
      ngayThang: '15/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ban ND Ấp 2',
      toSo: '43',
      loaiBan: 'Bản gốc'
    },
    {
      source: '024.jpg',
      soKyHieu: '',
      ngayThang: '15/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2018',
      tacGia: 'Hội Đồng Nhân Dân Xã Phú Lộc',
      toSo: '44-45',
      loaiBan: 'Bản gốc'
    },
    {
      source: '025.jpg',
      soKyHieu: '',
      ngayThang: '15/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng của Chủ tịch UBND xã Phú Lộc năm 2018 (tên tập thể đề nghị: Ban kinh tế xã hội HĐND xã Phú Lộc)',
      tacGia: 'Hội đồng nhân dân xã Phú Lộc',
      toSo: '46-47',
      loaiBan: 'Bản gốc'
    },
    {
      source: '026.jpg',
      soKyHieu: '',
      ngayThang: '16/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ban Nhân Dân Ấp 1',
      toSo: '48',
      loaiBan: 'Bản gốc'
    },
    {
      source: '027.jpg',
      soKyHieu: '',
      ngayThang: '16/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị Chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ban Nhân Dân Ấp 2',
      toSo: '49',
      loaiBan: 'Bản gốc'
    },
    {
      source: '028.jpg',
      soKyHieu: '',
      ngayThang: '18/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị Chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '50',
      loaiBan: 'Bản gốc'
    },
    {
      source: '029.jpg',
      soKyHieu: '',
      ngayThang: '18/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị Chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019, Đỗ Đình Tùng',
      tacGia: 'Đỗ Đình Tùng',
      toSo: '51',
      loaiBan: 'Bản gốc'
    },
    {
      source: '030.jpg',
      soKyHieu: '',
      ngayThang: '18/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen gia đình tiêu biểu trong công tác tuyển quân năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '52',
      loaiBan: 'Bản gốc'
    },
    {
      source: '031.jpg',
      soKyHieu: '',
      ngayThang: '18/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '53',
      loaiBan: 'Bản gốc'
    },
    {
      source: '032.jpg',
      soKyHieu: '',
      ngayThang: '18/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị Chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ban Công An Xã Phú Lộc',
      toSo: '54-55',
      loaiBan: 'Bản gốc'
    },
    {
      source: '033.jpg',
      soKyHieu: '',
      ngayThang: '18/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '56',
      loaiBan: 'Bản gốc'
    },
    {
      source: '034.jpg',
      soKyHieu: '',
      ngayThang: '18/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị Chủ tịch UBND xã khen thưởng trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '57',
      loaiBan: 'Bản gốc'
    },
    {
      source: '035.jpg',
      soKyHieu: '',
      ngayThang: '19/03/2019',
      trichYeu: 'Báo cáo thành tích cá nhân đề nghị khen thưởng của Chủ tịch UBND xã Phú Lộc năm 2019',
      tacGia: 'Hội đồng nhân dân xã Phú Lộc',
      toSo: '58-59',
      loaiBan: 'Bản gốc'
    },
    {
      source: '036.jpg',
      soKyHieu: '',
      ngayThang: '19/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị Chủ tịch UBND xã Phú Lộc tặng giấy khen đại biểu HĐND năm 2018',
      tacGia: 'Hội đồng nhân dân xã Phú Lộc',
      toSo: '60-63',
      loaiBan: 'Bản gốc'
    },
    {
      source: '037.jpg',
      soKyHieu: '',
      ngayThang: '19/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2018, Liễu Hoàng Toàn',
      tacGia: 'Liễu Hoàng Toàn',
      toSo: '64-65',
      loaiBan: 'Bản gốc'
    },
    {
      source: '038.jpg',
      soKyHieu: '',
      ngayThang: '19/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2018',
      tacGia: 'Hội đồng nhân dân xã Phú Lộc',
      toSo: '66-67',
      loaiBan: 'Bản gốc'
    },
    {
      source: '039.jpg',
      soKyHieu: '',
      ngayThang: '19/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã Phú Lộc năm 2018, Nguyễn Phước Tài',
      tacGia: 'Nguyễn Phước Tài',
      toSo: '68-69',
      loaiBan: 'Bản gốc'
    },
    {
      source: '040.jpg',
      soKyHieu: '',
      ngayThang: '19/03/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã Phú Lộc năm 2018 (tên tập thể đề nghị: Ban pháp chế HĐND xã Phú Lộc)',
      tacGia: 'Hội Đồng Nhân Dân Xã Phú Lộc',
      toSo: '70-71',
      loaiBan: 'Bản gốc'
    },
    {
      source: '041.jpg',
      soKyHieu: '03/QĐ-UBND',
      ngayThang: '20/03/2019',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các tập thể, cá nhân có thành tích xuất sắc trong công tác tuyển chọn gọi công dân nhập ngũ năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '72-78',
      loaiBan: 'Bản gốc'
    },
    {
      source: '042.jpg',
      soKyHieu: '04/QĐ-UBND',
      ngayThang: '20/03/2019',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các tập thể, cá nhân và đại biểu HĐND có thành tích xuất sắc trong hoạt động HĐND năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '79-85',
      loaiBan: 'Bản gốc'
    },
    {
      source: '043.jpg',
      soKyHieu: '01/TĐKT',
      ngayThang: '15/11/2019',
      trichYeu: 'Công văn về việc đăng ký thi đua năm 2020',
      tacGia: 'BCH Hội Nông dân xã Phú Lộc',
      toSo: '86-87',
      loaiBan: 'Bản gốc'
    },
    {
      source: '044.jpg',
      soKyHieu: '08/TTr-HND',
      ngayThang: '19/11/2019',
      trichYeu: 'Tờ trình về việc đề nghị HĐTĐ - KT xã khen thưởng cho tập thể chi hội và cán bộ hội viên có thành tích xuất sắc trong công tác Hội và phong trào nông dân năm 2019',
      tacGia: 'BCH Hội Nông dân xã Phú Lộc',
      toSo: '88-91',
      loaiBan: 'Bản gốc'
    },
    {
      source: '045.jpg',
      soKyHieu: '09/TTr-MTX',
      ngayThang: '27/11/2019',
      trichYeu: 'Tờ trình đề nghị Chủ tịch UBND xã, HĐTĐKT xã khen thưởng công tác mặt trận năm 2019',
      tacGia: 'UBMTTQ xã Phú Lộc',
      toSo: '92-94',
      loaiBan: 'Bản gốc'
    },
    {
      source: '046.jpg',
      soKyHieu: '09/TTr-CCB',
      ngayThang: '10/12/2019',
      trichYeu: 'Tờ trình về việc đề nghị tặng thưởng kỷ niệm chương Cựu Chiến binh Việt Nam',
      tacGia: 'Hội Cựu Chiến Binh Xã Phú Lộc',
      toSo: '95-97',
      loaiBan: 'Bản gốc'
    },
    {
      source: '047.jpg',
      soKyHieu: '01/TĐKT',
      ngayThang: '12/12/2019',
      trichYeu: 'Công văn về việc đăng ký thi đua năm 2020',
      tacGia: 'Ban CHQS Xã Phú Lộc',
      toSo: '98',
      loaiBan: 'Bản gốc'
    },
    {
      source: '048.jpg',
      soKyHieu: '02/BCH',
      ngayThang: '12/12/2019',
      trichYeu: 'Công văn về việc đăng ký thi đua năm 2020',
      tacGia: 'Ban CHQS Xã Phú Lộc',
      toSo: '99',
      loaiBan: 'Bản gốc'
    },
    {
      source: '049.jpg',
      soKyHieu: '31/TTr-BCH',
      ngayThang: '12/12/2019',
      trichYeu: 'Tờ trình về việc đề nghị Hội đồng thi đua khen thưởng xã Phú Lộc xét khen thưởng cho tập thể và cá nhân có thành tích xuất sắc trong phong trào thi đua quyết thắng năm 2019',
      tacGia: 'Ban Chỉ Huy Quân Sự Xã Phú Lộc',
      toSo: '100-103',
      loaiBan: 'Bản gốc'
    },
    {
      source: '050.jpg',
      soKyHieu: '',
      ngayThang: '16/12/2019',
      trichYeu: 'Tờ trình đề nghị chủ tịch UBND xã khen thưởng cho tập thể và cá nhân có thành tích xuất sắc trong công tác Mặt trận năm 2019',
      tacGia: 'Ủy ban Mặt trận Tổ quốc xã Phú Lộc',
      toSo: '104-108',
      loaiBan: 'Bản chính'
    },
    {
      source: '051.jpg',
      soKyHieu: '04/TTr-CA',
      ngayThang: '17/12/2019',
      trichYeu: 'Tờ trình về việc đề nghị khen thưởng phong trào thi đua "Vì an ninh Tổ quốc" năm 2019',
      tacGia: 'Ban Công an xã Phú Lộc',
      toSo: '109-113',
      loaiBan: 'Bản gốc'
    },
    {
      source: '052.jpg',
      soKyHieu: '01/TĐKT',
      ngayThang: '18/12/2019',
      trichYeu: 'Công văn về việc đăng ký thi đua năm 2020',
      tacGia: 'Đoàn TNCS Hồ Chí Minh Xã Phú Lộc - Ban Chấp Hành',
      toSo: '114-115',
      loaiBan: 'Bản gốc'
    },
    {
      source: '053.jpg',
      soKyHieu: '02/ĐTN',
      ngayThang: '18/12/2019',
      trichYeu: 'Công văn về việc đăng ký thi đua năm 2020',
      tacGia: 'BCH Đoàn Xã Phú Lộc',
      toSo: '116-118',
      loaiBan: 'Bản gốc'
    },
    {
      source: '054.jpg',
      soKyHieu: '32/Tr/NCT',
      ngayThang: '18/12/2019',
      trichYeu: 'Tờ trình về việc khen thưởng cán bộ hội viên người cao tuổi có thành tích xuất sắc trong phong trào thi đua "Tuổi cao - Gương sáng" năm 2019',
      tacGia: 'Ban Đại Diện Hội Người Cao Tuổi Xã Phú Lộc',
      toSo: '119-121',
      loaiBan: 'Bản gốc'
    },
    {
      source: '055.jpg',
      soKyHieu: '',
      ngayThang: '20/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng danh hiệu tập thể lao động tiên tiến',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '122-124',
      loaiBan: 'Bản gốc'
    },
    {
      source: '056.jpg',
      soKyHieu: '32/TĐKT/NCT',
      ngayThang: '20/12/2019',
      trichYeu: 'Công văn về việc đăng ký thi đua 2020',
      tacGia: 'Hội Người cao tuổi xã Phú Lộc',
      toSo: '125',
      loaiBan: 'Bản gốc'
    },
    {
      source: '057.jpg',
      soKyHieu: '36/TTr/ĐU',
      ngayThang: '20/12/2019',
      trichYeu: 'Tờ trình đề nghị khen thưởng cá nhân tập thể có thành tích xuất sắc trong phong trào thi đua yêu nước năm 2019',
      tacGia: 'Đảng ủy xã Phú Lộc',
      toSo: '126-134',
      loaiBan: 'Bản chính'
    },
    {
      source: '058.jpg',
      soKyHieu: '',
      ngayThang: '22/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND huyện',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '135',
      loaiBan: 'Bản gốc không mộc'
    },
    {
      source: '059.jpg',
      soKyHieu: '',
      ngayThang: '22/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND huyện',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '136-138',
      loaiBan: 'Bản gốc không mộc'
    },
    {
      source: '060.jpg',
      soKyHieu: '03-TTr/ĐTN',
      ngayThang: '23/12/2019',
      trichYeu: 'Tờ trình đề nghị HĐTĐKT xã khen thưởng cho các tập thể và cá nhân có thành tích xuất sắc trong công tác Đoàn năm 2019',
      tacGia: 'BCH Đoàn xã Phú Lộc',
      toSo: '139-143',
      loaiBan: 'Bản chính'
    },
    {
      source: '061.jpg',
      soKyHieu: '01/TĐKT',
      ngayThang: '23/12/2019',
      trichYeu: 'Công văn về việc đăng ký thi đua năm 2020',
      tacGia: 'Hội CCB xã Phú Lộc',
      toSo: '144-145',
      loaiBan: 'Bản gốc'
    },
    {
      source: '062.jpg',
      soKyHieu: '03/ĐKTĐ',
      ngayThang: '23/12/2019',
      trichYeu: 'Công văn về việc đăng ký thi đua năm 2020',
      tacGia: 'Khối dân vận - Đảng ủy xã Phú Lộc',
      toSo: '146-150',
      loaiBan: 'Bản gốc'
    },
    {
      source: '063.jpg',
      soKyHieu: '01-TĐKT/HPN',
      ngayThang: '24/12/2019',
      trichYeu: 'Công văn về việc đăng ký thi đua năm 2020',
      tacGia: 'Hội LHPN xã Phú Lộc - Ban Thường Vụ',
      toSo: '151-152',
      loaiBan: 'Bản gốc'
    },
    {
      source: '064.jpg',
      soKyHieu: '91/TB-HĐ.TĐKT',
      ngayThang: '25/12/2019',
      trichYeu: 'Thông báo kết luận chỉ đạo của Chủ tịch UBND xã - Chủ tịch Hội đồng thi đua khen thưởng xã tại cuộc họp xét khen thưởng phong trào thi đua yêu nước năm 2019',
      tacGia: 'Hội đồng Thi đua Khen thưởng xã Phú Lộc',
      toSo: '153-156',
      loaiBan: 'Bản chính'
    },
    {
      source: '065.jpg',
      soKyHieu: '13/QĐ-UBND',
      ngayThang: '26/12/2019',
      trichYeu: 'Quyết định về việc công nhận danh hiệu thi đua năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '157-158',
      loaiBan: 'Bản chính'
    },
    {
      source: '066.jpg',
      soKyHieu: '14/QĐ-UBND',
      ngayThang: '26/12/2019',
      trichYeu: 'Quyết định về việc tặng Giấy khen cho các tập thể và cá nhân có thành tích xuất sắc trong phong trào thi đua yêu nước năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '159-161',
      loaiBan: 'Bản chính'
    },
    {
      source: '067.jpg',
      soKyHieu: '',
      ngayThang: '26/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng danh hiệu Tập thể lao động tiên tiến',
      tacGia: 'Ban Công an xã Phú Lộc',
      toSo: '162-164',
      loaiBan: 'Bản gốc'
    },
    {
      source: '068.jpg',
      soKyHieu: '',
      ngayThang: '26/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng danh hiệu Tập thể lao động tiên tiến',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '165-167',
      loaiBan: 'Bản gốc'
    },
    {
      source: '069.jpg',
      soKyHieu: '',
      ngayThang: '26/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng danh hiệu Chiến sĩ thi đua cấp tỉnh của ông Bùi Hữu Phú',
      tacGia: 'Bùi Hữu Phú',
      toSo: '168-180',
      loaiBan: 'Photo'
    },
    {
      source: '070.jpg',
      soKyHieu: '',
      ngayThang: '26/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Bằng khen của Chủ tịch UBND tỉnh, đ/c Đỗ Đình Tùng',
      tacGia: 'Đỗ Đình Tùng',
      toSo: '181-188',
      loaiBan: 'Photo'
    },
    {
      source: '071.jpg',
      soKyHieu: '81/KH-UBND',
      ngayThang: '26/12/2019',
      trichYeu: 'Kế hoạch thực hiện công tác Thi đua, Khen thưởng năm 2020',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '189-190',
      loaiBan: 'Bản chính'
    },
    {
      source: '072.jpg',
      soKyHieu: '165/BC-HĐ.TĐKT',
      ngayThang: '26/12/2019',
      trichYeu: 'Báo cáo kết quả công tác thi đua, khen thưởng năm 2019 và phương hướng, nhiệm vụ công tác năm 2020',
      tacGia: 'HĐ.TĐKT xã Phú Lộc',
      toSo: '191-195',
      loaiBan: 'Bản chính'
    },
    {
      source: '073.jpg',
      soKyHieu: '',
      ngayThang: '26/12/2019',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND huyện',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '196-197',
      loaiBan: 'Bản gốc'
    },
    {
      source: '074.jpg',
      soKyHieu: '',
      ngayThang: '26/12/2019',
      trichYeu: 'Sáng kiến kinh nghiệm đề tài xây dựng, quản lý đơn vị chính quy, xanh, sạch, đẹp, chăm lo đời sống cho cán bộ, chiến sĩ',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '198-205',
      loaiBan: 'Bản gốc'
    },
    {
      source: '075.jpg',
      soKyHieu: '111/TTr-UBND',
      ngayThang: '27/12/2019',
      trichYeu: 'Tờ trình về việc đề nghị khen thưởng phong trào thi đua yêu nước năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '206-210',
      loaiBan: 'Bản chính'
    },
    {
      source: '076.jpg',
      soKyHieu: '584/UBND-TĐKT',
      ngayThang: '27/12/2019',
      trichYeu: 'Công văn về việc đăng ký thi đua năm 2020',
      tacGia: 'HĐ.TĐKT xã Phú Lộc',
      toSo: '211-213',
      loaiBan: 'Photo'
    },
    {
      source: '077.jpg',
      soKyHieu: '',
      ngayThang: '27/12/2019',
      trichYeu: 'Phiếu khen thưởng cuối năm 2019 (Giấy khen xã)',
      tacGia: 'HĐ.TĐKT xã Phú Lộc',
      toSo: '214-221',
      loaiBan: 'Photo'
    },
    {
      source: '078.jpg',
      soKyHieu: '',
      ngayThang: '27/12/2019',
      trichYeu: 'Phiếu xét khen thưởng cuối năm 2019',
      tacGia: 'HĐ.TĐKT xã Phú Lộc',
      toSo: '222-229',
      loaiBan: 'Bản gốc không mộc'
    },
    {
      source: '079.jpg',
      soKyHieu: '',
      ngayThang: '27/12/2019',
      trichYeu: 'Danh sách các tập thể đề nghị khen thưởng cuối năm 2019',
      tacGia: 'HĐ.TĐKT xã Phú Lộc',
      toSo: '230',
      loaiBan: 'Bản gốc không mộc'
    }
  ];

  job.data.rows = rawRows.map((r, idx) => ({
    soTT: String(idx + 1),
    soKyHieuVanBan: r.soKyHieu,
    ngayThangVanBan: r.ngayThang,
    tenLoaiTrichYeu: r.trichYeu,
    tacGiaVanBan: r.tacGia,
    toSoTrangSo: r.toSo,
    loaiBan: r.loaiBan,
    ghiChu: '',
    banGocChinh: (r.loaiBan === 'Photo' ? '' : r.loaiBan),
    banSao: (r.loaiBan === 'Photo' ? 'Photo' : ''),
    tomTatNoiDung: '',
    doMat: '',
    sourceFileNames: [r.source]
  }));

  job.data.rowsTrung = [];
  job.status = 'completed';
  job.updatedAt = new Date().toISOString();

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Updated job for ${dosId}`);

  // Export
  const out1 = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  const out2 = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  await exportJsonToExcel(job, out1);
  await exportJsonToExcel(job, out2);
  console.log(`Exported ${dosId} to Da_check and PL_outputOCR`);

  // Sync photo rows to Tl_loại_VP_Toàn_PL.xlsx
  console.log('Syncing Photo rows in 19W to Tl_loại_VP_Toàn_PL.xlsx...');
  for (const r of job.data.rows) {
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
}

async function process19X() {
  const dosId = 'PL_2019_19X';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ khen thưởng tập 3 năm 2019 xã Phú Lộc';
  job.data.tieuDeNghiQuyet = 'Hồ sơ khen thưởng tập 3 năm 2019 xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = '2019';
  job.data.tongSoToText = '';

  // Mark 001.jpg as skip (binder scrap slip over 002.jpg)
  if (job.images && job.images[0]) {
    job.images[0].status = 'skip';
    job.images[0].isExcluded = true;
    job.images[0].skipReason = 'Tờ giấy nháp kẹp ghim che trên văn bản 002.jpg';
  }

  // Active rows: 3 active rows
  job.data.rows = [
    {
      soTT: '1',
      soKyHieuVanBan: '',
      ngayThangVanBan: '10/01/2019',
      tenLoaiTrichYeu: 'Trích biên bản về việc đề nghị khen thưởng gương người tốt, việc tốt năm 2018',
      tacGiaVanBan: 'Đảng ủy xã Phú Lộc',
      toSoTrangSo: '01',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['002.jpg']
    },
    {
      soTT: '2',
      soKyHieuVanBan: '209/UBND',
      ngayThangVanBan: '21/03/2019',
      tenLoaiTrichYeu: 'Công văn về việc tập trung thực hiện thắng lợi cuộc Tổng điều tra Dân số và nhà ở năm 2019 trên địa bàn xã Phú Lộc',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '02-62',
      loaiBan: 'Bản gốc không mộc',
      ghiChu: '',
      banGocChinh: 'Bản gốc không mộc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['003.jpg']
    },
    {
      soTT: '3',
      soKyHieuVanBan: '23/KH-UBND',
      ngayThangVanBan: '25/03/2019',
      tenLoaiTrichYeu: 'Kế hoạch tuyên truyền các phong trào thi đua, các điển hình tiên tiến, mô hình mới, nhân tố mới trên địa bàn xã Phú Lộc năm 2019',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '63-65',
      loaiBan: 'Photo',
      ghiChu: '',
      banGocChinh: '',
      banSao: 'Photo',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['004.jpg', '005.jpg']
    }
  ];

  job.data.rowsTrung = [];
  job.status = 'completed';
  job.updatedAt = new Date().toISOString();

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Updated job for ${dosId}`);

  // Export
  const out1 = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  const out2 = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  await exportJsonToExcel(job, out1);
  await exportJsonToExcel(job, out2);
  console.log(`Exported ${dosId} to Da_check and PL_outputOCR`);

  // Sync photo rows to Tl_loại_VP_Toàn_PL.xlsx
  console.log('Syncing Photo row in 19X to Tl_loại_VP_Toàn_PL.xlsx...');
  await appendTaiLieuLoai({
    type: 'photo',
    tenVanBan: 'Kế hoạch tuyên truyền các phong trào thi đua, các điển hình tiên tiến, mô hình mới, nhân tố mới trên địa bàn xã Phú Lộc năm 2019',
    soHoSo: dosId,
    thbq: 'Vĩnh viễn'
  });
  console.log(`Synced Photo doc to Tl_loại for ${dosId}`);
}

async function main() {
  await process19W();
  await process19X();
  console.log('Batch 2019-11 processing finished successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
