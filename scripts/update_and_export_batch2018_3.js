import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function process18D() {
  const dosId = 'PL_2018_18D';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ Báo cáo (Tập 02) năm 2018 xã Phú Lộc (03/07/2018 đến 20/12/2018)';
  job.data.tieuDeNghiQuyet = 'Hồ sơ Báo cáo (Tập 02) năm 2018 xã Phú Lộc (03/07/2018 đến 20/12/2018)';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = '2018';
  job.data.tongSoToText = '';

  // Skip 001.jpg (scrap note)
  if (job.images && job.images[0]) {
    job.images[0].status = 'skip';
    job.images[0].isExcluded = true;
    job.images[0].skipReason = 'Tờ giấy nháp ghi chú đầu hồ sơ';
  }

  // Define exact 81 active rows (photos 002.jpg to 082.jpg)
  const starts = [
    { p: '002.jpg', s: 1, so: '94/BC-UBND', d: '03/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện công tác Hộ tịch; Công tác tiếp dân; Giải quyết đơn thư, khiếu nại - tố cáo 6 tháng đầu năm 2018' },
    { p: '003.jpg', s: 3, so: '95/BC-UBND', d: '05/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tóm tắt kết quả xác minh theo đơn tranh chấp của ông Nguyễn Anh thường trú tại ấp 1 với bà Trịnh Thị Hồng Hạnh tại ấp 3 xã Phú Lộc' },
    { p: '004.jpg', s: 4, so: '96/BC-UBND', d: '05/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả tổ chức "Tháng hành động vì trẻ em" của xã Phú Lộc năm 2018' },
    { p: '005.jpg', s: 5, so: '97/BC-UBND', d: '05/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kiểm điểm sự chỉ đạo, điều hành của UBND xã 6 tháng đầu năm 2018 và Chương trình công tác trọng tâm 6 tháng cuối năm 2018' },
    { p: '006.jpg', s: 8, so: '99/BC-UBND', d: '05/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện xây dựng cơ bản 06 tháng đầu năm 2018 và Phương hướng nhiệm vụ xây dựng cơ bản 06 tháng cuối năm 2018' },
    { p: '007.jpg', s: 10, so: '99/BC-UBND', d: '06/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo Quyết toán thu – chi ngân sách năm 2017' },
    { p: '008.jpg', s: 12, so: '100/BC-UBND', d: '06/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 07 năm 2018 phương hướng nhiệm vụ tháng 08 năm 2018' },
    { p: '009.jpg', s: 15, so: '101/BC-PCTT', d: '06/07/2018', tg: 'Ban Chỉ huy PCTT&TKCN Xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện nhiệm vụ công tác phòng, chống thiên tai và tìm kiếm cứu nạn năm 2017, phương hướng, nhiệm vụ năm 2018' },
    { p: '010.jpg', s: 19, so: '02/BC-UBND', d: '12/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về việc thực hiện nhiệm vụ quản lý nhà nước trong lĩnh vực đất đai trên địa bàn xã Phú Lộc' },
    { p: '011.jpg', s: 20, so: '43/BC-UBND', d: '12/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo thu-chi ngân sách 05 tháng đầu năm và ước thực hiện 7 tháng cuối năm 2018' },
    { p: '012.jpg', s: 21, so: '104/BC-UBND', d: '14/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện các tiêu chí nông thôn mới năm 2018 của xã Phú Lộc, huyện Tân Phú, tỉnh Đồng Nai' },
    { p: '013.jpg', s: 38, so: '105/BC-UBND', d: '16/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo giải trình tiêu chí số 5 về Trường học' },
    { p: '014.jpg', s: 39, so: '106/BC-UBND', d: '16/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo giải trình tiêu chí số 14 về Giáo dục và Đào tạo' },
    { p: '015.jpg', s: 40, so: '07/BC-UBND', d: '12/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo Giải trình tiêu chí số 15 về Y tế' },
    { p: '016.jpg', s: 41, so: '108/BC-UBND', d: '16/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả rà soát, lập danh sách trẻ em có hoàn cảnh khó khăn tham gia lớp học bơi miễn phí tại huyện' },
    { p: '017.jpg', s: 42, so: '109/BC-UBND', d: '16/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện tiêu chí 16 về Văn hóa theo Bộ tiêu chí Nông thôn mới' },
    { p: '018.jpg', s: 43, so: '110/BC-UBND', d: '16/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện Tiêu chí số 8 - về Thông tin và truyền thông theo Bộ tiêu chí Nông thôn mới' },
    { p: '019.jpg', s: 47, so: '111/BC-UBND', d: '16/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện tiêu chí 6 - về cơ sở vật chất văn hóa theo Bộ tiêu chí Nông thôn mới' },
    { p: '020.jpg', s: 49, so: '112/BC-UBND', d: '24/07/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện Kết luận của Thường trực Huyện ủy tại Hội nghị giao ban quý II/2018' },
    { p: '021.jpg', s: 51, so: '113/BC-BCĐ', d: '06/08/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo thực hiện xây dựng tuyến đường kiểu mẫu năm 2018' },
    { p: '022.jpg', s: 53, so: '114/BC-UBND', d: '06/08/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 8 năm 2018, phương hướng nhiệm vụ tháng 9 năm 2018' },
    { p: '023.jpg', s: 57, so: '115/BC-UBND', d: '06/08/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo đánh giá Chương trình mục tiêu Quốc gia xây dựng nông thôn mới năm 2018 trên địa bàn xã Phú Lộc' },
    { p: '024.jpg', s: 65, so: '116/BC-UBND', d: '13/08/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về việc bố trí, sử dụng cán bộ, công chức làm công tác tôn giáo' },
    { p: '025.jpg', s: 66, so: '118/BC-BCĐ', d: '13/08/2018', tg: 'Ban Chỉ đạo hè xã Phú Lộc', ty: 'Báo cáo Tổng kết hoạt động hè xã Phú Lộc năm 2018' },
    { p: '026.jpg', s: 70, so: '117/BC-UBND', d: '20/08/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo thực hiện xây dựng tuyến đường kiểu mẫu' },
    { p: '027.jpg', s: 71, so: '119/BC-UBND', d: '23/08/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo công tác tiếp dân, tiếp nhận và giải quyết khiếu nại, tố cáo tháng 8 năm 2018' },
    { p: '028.jpg', s: 72, so: '120/BC-UBND', d: '23/08/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về việc đề xuất đầu tư các công trình trường lớp học trên địa bàn xã Phú Lộc giai đoạn 2019 - 2020' },
    { p: '029.jpg', s: 74, so: '121/BC-UBND', d: '23/08/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-QPAN 9 tháng đầu năm và Phương hướng nhiệm vụ 3 tháng cuối năm 2018' },
    { p: '030.jpg', s: 82, so: '120/BC-UBND', d: '24/08/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về việc cung cấp thông tin lý lịch cán bộ, công chức năm 2018' },
    { p: '031.jpg', s: 83, so: '122/BC-UBND', d: '29/08/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình quản lý trật tự xây dựng tháng 8 năm 2018 trên địa bàn xã Phú Lộc' },
    { p: '032.jpg', s: 84, so: '123/BC-UBND', d: '29/08/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về việc cung cấp thông tin tài liệu liên quan đến nội dung thanh tra đất rừng phòng hộ Tân Phú' },
    { p: '033.jpg', s: 97, so: '124/BC-UBND', d: '30/08/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện cam kết bảo vệ môi trường của các cơ sở sản xuất kinh doanh' },
    { p: '034.jpg', s: 99, so: '125/BC-UBND', d: '07/09/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 9 năm 2018 và Phương hướng nhiệm vụ tháng 10 năm 2018' },
    { p: '035.jpg', s: 102, so: '125/BC-UBND', d: '08/09/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả đánh giá cải cách hành chính xã Phú Lộc năm 2018' },
    { p: '036.jpg', s: 105, so: '126/BC-UBND', d: '01/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả tổ chức Tết trung thu cho trẻ em năm 2018' },
    { p: '037.jpg', s: 106, so: '127/BC-UBND', d: '01/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về việc thực hiện tiến độ thu các nguồn vận động nhân dân đóng góp năm 2018' },
    { p: '038.jpg', s: 107, so: '128/TB-UBND', d: '02/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về việc rà soát, đề xuất thu hồi đất do vi phạm pháp luật đất đai trên địa bàn xã Phú Lộc' },
    { p: '039.jpg', s: 108, so: '130/BC-UBND', d: '02/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo sơ kết 03 năm thực hiện Kế hoạch số 114/KH-UBND ngày 23/10/2015 của UBND huyện Tân Phú' },
    { p: '040.jpg', s: 114, so: '133/BC-UBND', d: '08/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về việc ra quân tổng vệ sinh môi trường nhân Ngày Môi trường thế giới' },
    { p: '041.jpg', s: 115, so: '131/BC-UBND', d: '10/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 10 năm 2018 và Phương hướng nhiệm vụ tháng 11 năm 2018' },
    { p: '042.jpg', s: 118, so: '133/BC-UBND', d: '11/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về việc rà soát thống kê các điểm đen, điểm tiềm ẩn tai nạn giao thông trên địa bàn xã Phú Lộc' },
    { p: '043.jpg', s: 120, so: '134/BC-UBND', d: '15/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện Bảo hiểm y tế toàn dân 9 tháng đầu năm và Nhiệm vụ giải pháp 3 tháng cuối năm 2018' },
    { p: '044.jpg', s: 122, so: '135/BC-UBND', d: '15/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo Đánh giá hoạt động KTTT năm 2018 và Phương hướng phát triển năm 2019' },
    { p: '045.jpg', s: 124, so: '136/BC-UBND', d: '15/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình điều tra, khảo sát hộ nghèo, hộ cận nghèo năm 2018' },
    { p: '046.jpg', s: 125, so: '137/BC-UBND', d: '18/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình sinh trưởng và phát triển cây hoa Hoàng Yến trên địa bàn xã Phú Lộc' },
    { p: '047.jpg', s: 127, so: '138/BC-UBND', d: '18/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện trách nhiệm người đứng đầu trong việc phòng ngừa, phát hiện hành vi tham nhũng, xử lý người có hành vi tham nhũng' },
    { p: '048.jpg', s: 130, so: '139/BC-UBND', d: '25/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về việc giải quyết đơn khiếu nại của công dân' },
    { p: '049.jpg', s: 131, so: '141/BC-UBND', d: '23/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện công tác bảo đảm an toàn giao thông 9 tháng đầu năm 2018' },
    { p: '050.jpg', s: 134, so: '140/BC-UBND', d: '25/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện công tác giảm nghèo năm 2018' },
    { p: '051.jpg', s: 136, so: '147/BC-UBND', d: '29/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo công tác tiếp dân, tiếp nhận và giải quyết khiếu nại, tố cáo tháng 10 năm 2018' },
    { p: '052.jpg', s: 137, so: '142/BC-UBND', d: '30/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả triển khai thực hiện nhiệm vụ công tác cải cách hành chính năm 2018' },
    { p: '053.jpg', s: 148, so: '143/BC-UBND', d: '30/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện công tác gia đình năm 2018 và Phương hướng nhiệm vụ năm 2019' },
    { p: '054.jpg', s: 151, so: '144/BC-UBND', d: '31/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về kết quả tự đánh giá, chấm điểm công tác cải cách hành chính năm 2018' },
    { p: '055.jpg', s: 152, so: '145/BC-UBND', d: '31/10/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo giải thích cách đánh giá, chấm điểm tiêu chí, tiêu chí thành phần CCHC năm 2018' },
    { p: '056.jpg', s: 159, so: '146/BC-UBND', d: '05/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về cán bộ, công chức đạt chuẩn và chưa đạt chuẩn theo quy định' },
    { p: '057.jpg', s: 161, so: '147/BC-UBND', d: '05/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo thực hiện công tác quản lý tài chính, tài sản công đoàn năm 2018' },
    { p: '058.jpg', s: 164, so: '148/BC-UBND', d: '05/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo Kết quả điều tra, thống kê danh sách người khuyết tật trên địa bàn xã Phú Lộc' },
    { p: '059.jpg', s: 167, so: '149/BC-UBND', d: '07/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tổng kết công tác văn thư, lưu trữ năm 2018 và Phương hướng nhiệm vụ năm 2019' },
    { p: '060.jpg', s: 172, so: '150/BC-UBND', d: '09/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 11 năm 2018 và Phương hướng nhiệm vụ tháng 12 năm 2018' },
    { p: '061.jpg', s: 175, so: '151/BC-BCĐ', d: '15/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện Chương trình mục tiêu Quốc gia giảm nghèo bền vững năm 2018' },
    { p: '062.jpg', s: 178, so: '152/BC-UBND', d: '19/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kiểm điểm sự chỉ đạo, điều hành của UBND xã năm 2018' },
    { p: '063.jpg', s: 181, so: '154/BC-UBND', d: '20/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện Nghị quyết của HĐND xã về mục tiêu, nhiệm vụ năm 2018' },
    { p: '064.jpg', s: 184, so: '155/BC-UBND', d: '21/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo công tác quản lý địa giới hành chính năm 2018' },
    { p: '065.jpg', s: 185, so: '156/BC-PCTT', d: '26/11/2018', tg: 'Ban Chỉ huy PCTT&TKCN Xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện công tác phòng chống thiên tai và tìm kiếm cứu nạn năm 2018' },
    { p: '066.jpg', s: 186, so: '157/BC-BCĐ', d: '26/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện công tác phòng chống tội phạm, tệ nạn xã hội năm 2018' },
    { p: '067.jpg', s: 189, so: '158/BC-UBND', d: '29/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo đánh giá tình hình thực hiện nhiệm vụ KTXH-ANQP năm 2018 và Kế hoạch phát triển KTXH-ANQP năm 2019' },
    { p: '068.jpg', s: 198, so: '159/BC-BCĐ', d: '29/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo công tác đảm bảo TTATGT năm 2018 và Phương hướng nhiệm vụ năm 2019' },
    { p: '069.jpg', s: 200, so: '160/BC-UBND', d: '30/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện quy chế dân chủ ở cơ sở năm 2018' },
    { p: '070.jpg', s: 204, so: '161/BC-UBND', d: '02/12/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện công tác tư pháp, hộ tịch năm 2018 và Phương hướng nhiệm vụ năm 2019' },
    { p: '071.jpg', s: 205, so: '162/BC-UBND', d: '05/12/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo công tác cấp, phát giấy CNQSDĐ trên địa bàn xã Phú Lộc năm 2018' },
    { p: '072.jpg', s: 206, so: '163/BC-UBND', d: '05/12/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện chương trình mục tiêu quốc gia xây dựng NTM năm 2018' },
    { p: '073.jpg', s: 209, so: '164/BC-UBND', d: '03/12/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả thực hiện cơ chế một cửa, một cửa liên thông hiện đại năm 2018' },
    { p: '074.jpg', s: 211, so: '166/BC-UBND', d: '07/12/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả giải quyết thủ tục hành chính năm 2018' },
    { p: '075.jpg', s: 214, so: '168/BC-UBND', d: '10/12/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 12 năm 2018' },
    { p: '076.jpg', s: 217, so: '169/BC-UBND', d: '11/12/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện nhiệm vụ văn hóa - xã hội năm 2018' },
    { p: '077.jpg', s: 219, so: '170/BC-UBND', d: '13/12/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả điều tra thu nhập bình quân đầu người năm 2018' },
    { p: '078.jpg', s: 223, so: '171/BC-UBND', d: '13/12/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo kết quả họp xét đánh giá, phân loại cán bộ, công chức năm 2018' },
    { p: '079.jpg', s: 228, so: '172/BC-UBND', d: '13/12/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo về việc báo cáo tiến độ đầu tư lưới điện hạ thế sau các công trình điện trung thế' },
    { p: '080.jpg', s: 230, so: '173/BC-UBND', d: '18/12/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thu - chi ngân sách năm 2018 (Số liệu ước tính đến 17/12/2018)' },
    { p: '081.jpg', s: 232, so: '174/BC-UBND', d: '20/12/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Báo cáo tình hình thực hiện nhiệm vụ Phát triển KTXH-ANQP năm 2018 và phương hướng thực hiện nhiệm vụ KTXH-ANQP năm 2019' },
    { p: '082.jpg', s: 242, so: '', d: '2018', tg: 'Ủy ban nhân dân xã Phú Lộc', ty: 'Phụ lục bảng chỉ tiêu thực hiện nhiệm vụ KTXH-QPAN năm 2018' }
  ];

  job.data.rows = starts.map((cur, idx) => {
    const next = starts[idx + 1];
    const end = next ? next.s - 1 : 242;
    const toSo = cur.s === end ? String(cur.s).padStart(2, '0') : String(cur.s).padStart(2, '0') + '-' + String(end).padStart(2, '0');

    return {
      soTT: String(idx + 1),
      soKyHieuVanBan: cur.so,
      ngayThangVanBan: cur.d,
      tenLoaiTrichYeu: cur.ty,
      tacGiaVanBan: cur.tg,
      toSoTrangSo: toSo,
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: [cur.p]
    };
  });

  job.data.rowsTrung = [];
  job.status = 'completed';
  job.updatedAt = new Date().toISOString();

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Updated job for ${dosId} with ${job.data.rows.length} rows.`);

  const out1 = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  const out2 = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  await exportJsonToExcel(job, out1);
  await exportJsonToExcel(job, out2);
  console.log(`Exported ${dosId} to Da_check and PL_outputOCR successfully.`);
}

process18D().catch(err => {
  console.error(err);
  process.exit(1);
});
