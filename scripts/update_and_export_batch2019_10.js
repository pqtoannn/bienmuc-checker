import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function process19U() {
  const dosId = 'PL_2019_19U';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ công nhận sáng kiến giải pháp kinh nghiệm năm 2019 xã Phú Lộc';
  job.data.tieuDeNghiQuyet = 'Hồ sơ công nhận sáng kiến giải pháp kinh nghiệm năm 2019 xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = '2019';
  job.data.tongSoToText = '';

  // Mark 001.jpg as skip (cover)
  if (job.images && job.images[0]) {
    job.images[0].status = 'skip';
    job.images[0].isExcluded = true;
    job.images[0].skipReason = 'Bìa hồ sơ lưu trữ';
  }

  // Active rows
  job.data.rows = [
    {
      soTT: '1',
      soKyHieuVanBan: '',
      ngayThangVanBan: '09/11/2019',
      tenLoaiTrichYeu: 'Báo cáo tóm tắt sáng kiến kinh nghiệm năm 2019 về phương pháp sáng kiến mô hình có hiệu quả trong công tác đảm bảo trật tự an toàn giao thông, đ/c Đỗ Đình Tùng',
      tacGiaVanBan: 'Đỗ Đình Tùng',
      toSoTrangSo: '01-03',
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
      soKyHieuVanBan: '',
      ngayThangVanBan: '13/11/2019',
      tenLoaiTrichYeu: 'Báo cáo sáng kiến về việc Gây quỹ tình thương Hướng tới tương lai, đ/c Đào Thị Vàng',
      tacGiaVanBan: 'Đào Thị Vàng',
      toSoTrangSo: '04-06',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['003.jpg']
    },
    {
      soTT: '3',
      soKyHieuVanBan: '',
      ngayThangVanBan: '15/11/2019',
      tenLoaiTrichYeu: 'Báo cáo tóm tắt sáng kiến kinh nghiệm năm 2019 về việc tổ chức tuyên truyền về BHYT nhằm nâng cao ý thức tham gia BHYT tự nguyện của Người Dân, đ/c Lê Trương Minh Tuấn',
      tacGiaVanBan: 'Lê Trương Minh Tuấn',
      toSoTrangSo: '07-08',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['004.jpg']
    },
    {
      soTT: '4',
      soKyHieuVanBan: '95/TTr-UBND',
      ngayThangVanBan: '18/11/2019',
      tenLoaiTrichYeu: 'Tờ trình về việc đề nghị khen thưởng cá nhân thực hiện báo cáo sáng kiến, giải pháp kinh nghiệm năm 2019',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '09-12',
      loaiBan: 'Bản chính',
      ghiChu: '',
      banGocChinh: 'Bản chính',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['005.jpg']
    },
    {
      soTT: '5',
      soKyHieuVanBan: '',
      ngayThangVanBan: '15/11/2019',
      tenLoaiTrichYeu: 'Báo cáo sáng kiến kinh nghiệm năm 2019 về phong trào đền ơn đáp nghĩa và xây dựng nông thôn mới, đ/c Bùi Hữu Phú',
      tacGiaVanBan: 'Bùi Hữu Phú',
      toSoTrangSo: '13-42',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['006.jpg']
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
}

async function process19V() {
  const dosId = 'PL_2019_19V';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ thi đua khen thưởng năm 2019 xã Phú Lộc';
  job.data.tieuDeNghiQuyet = 'Hồ sơ thi đua khen thưởng năm 2019 xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = '2019';
  job.data.tongSoToText = '';

  // Mark 001.jpg as skip (scrap paper note over 002.jpg)
  if (job.images && job.images[0]) {
    job.images[0].status = 'skip';
    job.images[0].isExcluded = true;
    job.images[0].skipReason = 'Mảnh giấy nháp ghi số hồ sơ chụp đè lên văn bản';
  }

  // 26 Active rows
  job.data.rows = [
    {
      soTT: '1',
      soKyHieuVanBan: '01/QĐ-UBND',
      ngayThangVanBan: '06/01/2020',
      tenLoaiTrichYeu: 'Quyết định về việc tặng giấy khen cho tập thể và cá nhân có thành tích xuất sắc trong hoạt động HĐND năm 2019',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '01-02',
      loaiBan: 'Bản chính',
      ghiChu: '',
      banGocChinh: 'Bản chính',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['002.jpg']
    },
    {
      soTT: '2',
      soKyHieuVanBan: '02/QĐ-UBND',
      ngayThangVanBan: '06/01/2020',
      tenLoaiTrichYeu: 'Quyết định về việc tặng giấy khen cá nhân có thành tích đột xuất trong công tác đấu tranh phòng chống tội phạm',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '03-14',
      loaiBan: 'Bản chính',
      ghiChu: '',
      banGocChinh: 'Bản chính',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['003.jpg']
    },
    {
      soTT: '3',
      soKyHieuVanBan: '',
      ngayThangVanBan: '02/01/2020',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng giấy khen có thành tích xuất sắc về hoạt động của đại biểu HĐND năm 2019, đ/c Võ Văn Quân',
      tacGiaVanBan: 'Võ Văn Quân',
      toSoTrangSo: '15',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['004.jpg']
    },
    {
      soTT: '4',
      soKyHieuVanBan: '',
      ngayThangVanBan: '31/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã, đ/c Lê Văn Lâm',
      tacGiaVanBan: 'Lê Văn Lâm',
      toSoTrangSo: '16',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['005.jpg']
    },
    {
      soTT: '5',
      soKyHieuVanBan: '',
      ngayThangVanBan: '20/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị UBND xã tặng giấy khen năm 2019, đ/c Nguyễn Đào Thanh Tần',
      tacGiaVanBan: 'Nguyễn Đào Thanh Tần',
      toSoTrangSo: '17-19',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['006.jpg']
    },
    {
      soTT: '6',
      soKyHieuVanBan: '11/TTr-HĐND',
      ngayThangVanBan: '20/12/2019',
      tenLoaiTrichYeu: 'Tờ trình về việc đề nghị xét khen thưởng tập thể, cá nhân đại biểu HĐND đã hoàn thành xuất sắc trong hoạt động HĐND năm 2019',
      tacGiaVanBan: 'Hội đồng nhân dân xã Phú Lộc',
      toSoTrangSo: '20-41',
      loaiBan: 'Bản chính',
      ghiChu: '',
      banGocChinh: 'Bản chính',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['007.jpg']
    },
    {
      soTT: '7',
      soKyHieuVanBan: '',
      ngayThangVanBan: '23/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2019 (Ban Pháp chế HĐND xã Phú Lộc)',
      tacGiaVanBan: 'Ban Pháp chế HĐND xã Phú Lộc',
      toSoTrangSo: '42-43',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['008.jpg']
    },
    {
      soTT: '8',
      soKyHieuVanBan: '',
      ngayThangVanBan: '20/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị UBND xã tặng giấy khen năm 2019, đ/c Trần Văn Sang',
      tacGiaVanBan: 'Trần Văn Sang',
      toSoTrangSo: '44-46',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['009.jpg']
    },
    {
      soTT: '9',
      soKyHieuVanBan: '',
      ngayThangVanBan: '30/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị Hội đồng thi đua khen thưởng xã Phú Lộc tặng giấy khen Đại biểu HĐND hoàn thành xuất sắc nhiệm vụ năm 2019, đ/c Liêu Hoàng Toàn',
      tacGiaVanBan: 'Liêu Hoàng Toàn',
      toSoTrangSo: '47-49',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['010.jpg']
    },
    {
      soTT: '10',
      soKyHieuVanBan: '',
      ngayThangVanBan: '30/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2019, đ/c Huỳnh Văn Bé Sáu',
      tacGiaVanBan: 'Huỳnh Văn Bé Sáu',
      toSoTrangSo: '50',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['011.jpg']
    },
    {
      soTT: '11',
      soKyHieuVanBan: '',
      ngayThangVanBan: '30/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng giấy khen của Chủ tịch UBND xã Phú Lộc, đ/c Võ Văn Hải',
      tacGiaVanBan: 'Võ Văn Hải',
      toSoTrangSo: '51-52',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['012.jpg']
    },
    {
      soTT: '12',
      soKyHieuVanBan: '',
      ngayThangVanBan: '31/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã, đ/c Đỗ Đình Tùng',
      tacGiaVanBan: 'Đỗ Đình Tùng',
      toSoTrangSo: '53',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['013.jpg']
    },
    {
      soTT: '13',
      soKyHieuVanBan: '',
      ngayThangVanBan: '30/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng của Chủ tịch UBND xã Phú Lộc năm 2019 (Ban Kinh tế - Xã hội HĐND xã Phú Lộc)',
      tacGiaVanBan: 'Ban Kinh tế - Xã hội HĐND xã Phú Lộc',
      toSoTrangSo: '54-55',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['014.jpg']
    },
    {
      soTT: '14',
      soKyHieuVanBan: '',
      ngayThangVanBan: '30/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2019 (đ/c Nguyễn Hoài Thương - Trưởng Ban Kinh tế - Xã hội HĐND xã)',
      tacGiaVanBan: 'Nguyễn Hoài Thương',
      toSoTrangSo: '56',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['015.jpg']
    },
    {
      soTT: '15',
      soKyHieuVanBan: '',
      ngayThangVanBan: '30/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2019 (Ban Pháp chế HĐND xã Phú Lộc)',
      tacGiaVanBan: 'Ban Pháp chế HĐND xã Phú Lộc',
      toSoTrangSo: '57-58',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['016.jpg']
    },
    {
      soTT: '16',
      soKyHieuVanBan: '',
      ngayThangVanBan: '30/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc năm 2019, đ/c Nguyễn Phước Tài',
      tacGiaVanBan: 'Nguyễn Phước Tài',
      toSoTrangSo: '59-60',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['017.jpg']
    },
    {
      soTT: '17',
      soKyHieuVanBan: '',
      ngayThangVanBan: '30/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã Phú Lộc năm 2019, đ/c Nguyễn Ngọc Tú',
      tacGiaVanBan: 'Nguyễn Ngọc Tú',
      toSoTrangSo: '61-62',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['018.jpg']
    },
    {
      soTT: '18',
      soKyHieuVanBan: '',
      ngayThangVanBan: '22/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng Giấy khen của Chủ tịch UBND xã, đ/c Bùi Hữu Phú',
      tacGiaVanBan: 'Bùi Hữu Phú',
      toSoTrangSo: '63-64',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['019.jpg']
    },
    {
      soTT: '19',
      soKyHieuVanBan: '',
      ngayThangVanBan: '23/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích cá nhân đề nghị khen thưởng của Chủ tịch UBND xã Phú Lộc năm 2019, đ/c Huỳnh Văn Bé Sáu',
      tacGiaVanBan: 'Huỳnh Văn Bé Sáu',
      toSoTrangSo: '65',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['020.jpg']
    },
    {
      soTT: '20',
      soKyHieuVanBan: '',
      ngayThangVanBan: '31/12/2019',
      tenLoaiTrichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã, đ/c Phan Văn Tuyền',
      tacGiaVanBan: 'Phan Văn Tuyền',
      toSoTrangSo: '66',
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['021.jpg']
    },
    {
      soTT: '21',
      soKyHieuVanBan: '13/QĐ-UBND',
      ngayThangVanBan: '04/03/2019',
      tenLoaiTrichYeu: 'Quyết định ban hành Quy định chấm điểm và tiêu chí bình xét thi đua đối với cá nhân, tập thể thuộc Ủy ban nhân dân xã Phú Lộc',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '67-74',
      loaiBan: 'Bản chính',
      ghiChu: '',
      banGocChinh: 'Bản chính',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['022.jpg']
    },
    {
      soTT: '22',
      soKyHieuVanBan: '12/QĐ-UBND',
      ngayThangVanBan: '04/03/2019',
      tenLoaiTrichYeu: 'Quyết định về việc ban hành Quy chế về công tác thi đua, khen thưởng trên địa bàn xã Phú Lộc',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '75-79',
      loaiBan: 'Bản chính',
      ghiChu: '',
      banGocChinh: 'Bản chính',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['023.jpg']
    },
    {
      soTT: '23',
      soKyHieuVanBan: '38/QĐ-UBND',
      ngayThangVanBan: '04/05/2020',
      tenLoaiTrichYeu: 'Quyết định về việc củng cố Hội đồng thi đua khen thưởng xã Phú Lộc',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '80-81',
      loaiBan: 'Bản chính',
      ghiChu: '',
      banGocChinh: 'Bản chính',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['024.jpg']
    },
    {
      soTT: '24',
      soKyHieuVanBan: '176/QĐ-UBND',
      ngayThangVanBan: '26/12/2017',
      tenLoaiTrichYeu: 'Quyết định về việc ban hành Quy chế tổ chức và hoạt động của Hội đồng Thi đua-Khen thưởng xã Phú Lộc',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '82-85',
      loaiBan: 'Bản chính',
      ghiChu: '',
      banGocChinh: 'Bản chính',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['025.jpg']
    },
    {
      soTT: '25',
      soKyHieuVanBan: '61/KH-UBND',
      ngayThangVanBan: '25/09/2019',
      tenLoaiTrichYeu: 'Kế hoạch tổ chức Hội nghị điển hình tiên tiến cấp cơ sở giai đoạn 2015-2020 trên địa bàn xã Phú Lộc',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '86-99',
      loaiBan: 'Bản chính',
      ghiChu: '',
      banGocChinh: 'Bản chính',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['026.jpg']
    },
    {
      soTT: '26',
      soKyHieuVanBan: '165/BC-HĐ.TĐKT',
      ngayThangVanBan: '26/12/2019',
      tenLoaiTrichYeu: 'Báo cáo Thống kê kết quả khen thưởng năm 2019 (Kèm theo báo cáo số 165/BC-HĐ.TĐKT ngày 26/12/2019 của HĐ.TĐKT xã Phú Lộc)',
      tacGiaVanBan: 'Hội đồng Thi đua - Khen thưởng xã Phú Lộc',
      toSoTrangSo: '100',
      loaiBan: 'Bản chính',
      ghiChu: '',
      banGocChinh: 'Bản chính',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['027.jpg']
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
}

async function main() {
  await process19U();
  await process19V();
  console.log('Batch 2019-10 processing completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
