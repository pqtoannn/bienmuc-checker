import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function process18C() {
  const dosId = 'PL_2018_18C';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ Báo cáo (Tập 01) năm 2018 xã Phú Lộc (01/01/2018 đến 29/06/2018)';
  job.data.tieuDeNghiQuyet = 'Hồ sơ Báo cáo (Tập 01) năm 2018 xã Phú Lộc (01/01/2018 đến 29/06/2018)';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = '2018';
  job.data.tongSoToText = '';

  // Skip 001.jpg (cover)
  if (job.images && job.images[0]) {
    job.images[0].status = 'skip';
    job.images[0].isExcluded = true;
    job.images[0].skipReason = 'Bìa hồ sơ';
  }

  const rawExcelData = [
    { p: '002.jpg', so: '01/BC-PCTT-TKCN', d: '01/01/2018', ty: 'Báo cáo về việc kiểm kê trang thiết bị phục vụ công tác tìm kiếm cứu nạn tại thời điểm 0 giờ ngày 01/01/2018', tg: 'Ban Chỉ huy PCTT-TKCN Xã Phú Lộc', s: 1 },
    { p: '003.jpg', so: '01/BC-UBND', d: '03/01/2018', ty: 'Báo cáo về việc bà Nguyễn Thị Trường Giang không đến nhận tiền hỗ trợ hạn hán năm 2015-2016', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 2 },
    { p: '004.jpg', so: '02/BC-UBND', d: '03/01/2018', ty: 'Báo cáo về việc giải quyết tranh chấp đất đai của Ông Mai Thế Cường và Bà Phan Thị Thuyết thường trú ấp 1, xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 3 },
    { p: '005.jpg', so: '03/BC-UBND', d: '04/01/2018', ty: 'Báo cáo kết quả thực hiện công tác gia đình năm 2017 và phương hướng nhiệm vụ năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 4 },
    { p: '006.jpg', so: '04/BC-UBND', d: '04/01/2018', ty: 'Báo cáo về việc tổ chức thực hiện kết luận giám sát của Ban Pháp chế HĐND huyện Tân Phú khóa VI, nhiệm kỳ 2016-2021', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 6 },
    { p: '007.jpg', so: '05/BC-UBND', d: '04/01/2018', ty: 'Báo cáo công tác quản lý sử dụng, bảo vệ công trình xây dựng', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 7 },
    { p: '008.jpg', so: '06/BC-UBND', d: '10/01/2018', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 01 năm 2018, phương hướng nhiệm vụ tháng 02 năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 8 },
    { p: '009.jpg', so: '07/BC-UBND', d: '10/01/2018', ty: 'Báo cáo về việc tăng cường kiểm tra, xử lý các tụ điểm kinh doanh trò chơi điện tử máy bắn cá trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 12 },
    { p: '010.jpg', so: '08/BC-UBND', d: '11/01/2018', ty: 'Báo cáo về việc báo cáo kết quả thực hiện nghị quyết số 09-NQ/TU ngày 22/8/2017 của Ban chấp hành Đảng bộ huyện', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 13 },
    { p: '011.jpg', so: '09/BC-UBND', d: '22/01/2018', ty: 'Báo cáo kết quả giải quyết đơn của ông Lầu Vả Bẩu', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 15 },
    { p: '012.jpg', so: '11/BC-UBND', d: '22/01/2018', ty: 'Báo cáo về việc thu hồi giấy CNQSDĐ của các hộ dân để chỉnh lý cấp đường', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 16 },
    { p: '013.jpg', so: '12/BC-UBND', d: '22/01/2018', ty: 'Báo cáo tình hình cấp và thanh quyết toán tiền hỗ trợ thiệt hại do thiên tai lốc xoáy gây ra trên địa bàn xã Phú Lộc năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 17 },
    { p: '014.jpg', so: '13/BC-UBND', d: '23/01/2018', ty: 'Báo cáo tình hình đề xuất chủ trương đầu tư xã hội hóa các công trình đường giao thông nông thôn năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 18 },
    { p: '015.jpg', so: '14/BC-UBND', d: '02/2018', ty: 'Báo cáo tình hình thực hiện nhiệm vụ trước Tết Nguyên Đán Mậu Tuất năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 19 },
    { p: '016.jpg', so: '15/BC-UBND', d: '09/02/2018', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 02 năm 2018 và phương hướng nhiệm vụ tháng 03 năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 20 },
    { p: '017.jpg', so: '17/BC-UBND', d: '20/02/2018', ty: 'Báo cáo kết quả minh bạch tài sản, thu nhập năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 24 },
    { p: '018.jpg', so: '18/BC-UBND', d: '02/03/2018', ty: 'Báo cáo nhanh về việc uống sữa học đường bị ngộ độc tại trường Tiểu học Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 29 },
    { p: '019.jpg', so: '19/BC-UBND', d: '05/03/2018', ty: 'Báo cáo về công tác cán bộ của UBND xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 31 },
    { p: '020.jpg', so: '20/BC-UBND', d: '06/03/2018', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP quý I/2018 phương hướng nhiệm vụ quý II/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 35 },
    { p: '021.jpg', so: '21/BC-UBND', d: '08/03/2018', ty: 'Báo cáo về việc rà soát, bổ sung lưới điện trung thế và TBA trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 37 },
    { p: '022.jpg', so: '22/BC-UBND', d: '12/03/2018', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 3 năm 2018, phương hướng nhiệm vụ tháng 4 năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 38 },
    { p: '023.jpg', so: '22a/BC-UBND', d: '16/03/2018', ty: 'Báo cáo thành tích tập thể, đề nghị UBND xã tặng giấy khen có thành tích xuất sắc trong công tác tuyển quân năm 2018', tg: 'Hội đồng NVQS xã Phú Lộc', s: 41 },
    { p: '024.jpg', so: '23/BC-UBND', d: '19/03/2018', ty: 'Báo cáo kết quả 5 năm thực hiện đề án “Tổ chức các hoạt động truyền thông về cải cách hành chính giai đoạn 2013-2020”', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 43 },
    { p: '025.jpg', so: '24/BC-UBND', d: '19/03/2018', ty: 'Báo cáo tình hình thực hiện công tác cải cách hành chính, kiểm soát TTHC quý I năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 44 },
    { p: '026.jpg', so: '25/BC-HĐ.NVQS', d: '19/03/2018', ty: 'Báo cáo kết quả triển khai thực hiện các bước tuyển chọn gọi công dân nhập ngũ và tham gia nghĩa vụ công an nhân dân năm 2018', tg: 'Hội đồng NVQS xã Phú Lộc', s: 48 },
    { p: '027.jpg', so: '26/BC-UBND', d: '06/04/2018', ty: 'Báo cáo kết quả thực hiện công tác bàn giao chuyển đổi vị trí công tác đối với các chức danh chuyên môn theo Quyết định số 29/QĐ-UBND', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 52 },
    { p: '028.jpg', so: '27/BC-UBND', d: '02/04/2018', ty: 'Báo cáo về việc báo cáo kết quả thực hiện Nghị quyết số 09-NQ/TU ngày 22/8/2017 của Ban chấp hành Đảng bộ huyện', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 53 },
    { p: '029.jpg', so: '28/BC-UBND', d: '10/04/2018', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 4 năm 2018, phương hướng nhiệm vụ tháng 5 năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 55 },
    { p: '030.jpg', so: '29/BC-UBND', d: '12/04/2018', ty: 'Báo cáo về việc giải quyết kiến nghị của phụ huynh học sinh trường Tiểu học Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 59 },
    { p: '031.jpg', so: '30/BC-UBND', d: '12/04/2018', ty: 'Báo cáo kết quả triển khai thực hiện các bước tuyển chọn gọi công dân nhập ngũ và tham gia nghĩa vụ CAND năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 60 },
    { p: '032.jpg', so: '31/BC-UBND', d: '16/04/2018', ty: 'Báo cáo về việc chấn chỉnh việc chấp hành kỷ luật, kỷ cương hành chính và văn hóa công vụ của cán bộ, công chức năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 64 },
    { p: '033.jpg', so: '32/BC-UBND', d: '18/04/2018', ty: 'Báo cáo tình hình thực hiện hoạt động đấu thầu năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 65 },
    { p: '034.jpg', so: '33/BC-UBND', d: '19/04/2018', ty: 'Báo cáo về việc rà soát các thửa đất do UBND xã đang quản lý và sử dụng trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 66 },
    { p: '035.jpg', so: '35/BC-UBND', d: '24/04/2018', ty: 'Báo cáo rà soát về công tác quản lý xây dựng nhà ở riêng lẻ nông thôn trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 67 },
    { p: '036.jpg', so: '36/BC-UBND', d: '24/04/2018', ty: 'Báo cáo kiểm tra các cơ sở giáo dục Mầm non ngoài công lập trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 68 },
    { p: '037.jpg', so: '37/BC-UBND', d: '07/05/2018', ty: 'Báo cáo sơ kết 5 năm thực hiện chỉ thị số 23-CT/TU ngày 27/5/2013 của Ban Thường vụ Tỉnh ủy', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 69 },
    { p: '038.jpg', so: '38/BC-UBND', d: '08/05/2018', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 5 năm 2018, phương hướng nhiệm vụ tháng 6 năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 71 },
    { p: '039.jpg', so: '39/BC-UBND', d: '09/05/2018', ty: 'Báo cáo kết quả rà soát CBCC đi nước ngoài của UBND xã Phú Lộc năm 2017 và quý I năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 74 },
    { p: '040.jpg', so: '40/BC-UBND', d: '03/05/2018', ty: 'Báo cáo về việc giải trình nguyên nhân diện tích đất nông nghiệp bị giảm theo bản đồ khoanh vẽ hiện trạng năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 75 },
    { p: '041.jpg', so: '41/BC-UBND', d: '09/05/2018', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 5 năm 2018 và phương hướng nhiệm vụ tháng 6 năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 76 },
    { p: '042.jpg', so: '42/BC-BCĐ', d: '08/05/2018', ty: 'Báo cáo sơ kết công tác đảm bảo TTATGT 6 tháng đầu năm 2018 và phương hướng nhiệm vụ 6 tháng cuối năm 2018', tg: 'Ban An toàn giao thông Xã Phú Lộc', s: 82 },
    { p: '043.jpg', so: '43/BC-BCĐ', d: '09/05/2018', ty: 'Báo cáo kết quả sơ kết 6 tháng công tác PCCC và CNCH năm 2018, phương hướng nhiệm vụ 6 tháng cuối năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc - BCĐ PCCC', s: 84 },
    { p: '044.jpg', so: '44/BC-UBND', d: '14/05/2018', ty: 'Báo cáo công tác quản lý tài sản kết cấu hạ tầng giao thông đường bộ năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 86 },
    { p: '045.jpg', so: '45/BC-UBND', d: '14/05/2018', ty: 'Báo cáo kết quả kiểm tra việc niêm yết công khai thủ tục hành chính tại Bộ phận tiếp nhận và trả kết quả xã Phú Lộc năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 87 },
    { p: '046.jpg', so: '46/BC-UBND', d: '17/05/2018', ty: 'Báo cáo về việc rà soát thực trạng công chức, người hoạt động không chuyên trách cấp xã', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 88 },
    { p: '047.jpg', so: '47/BC-UBND', d: '18/05/2018', ty: 'Báo cáo tình hình phân loại, thu gom và vận chuyển chất thải rắn sinh hoạt trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 91 },
    { p: '048.jpg', so: '48/BC-UBND', d: '21/05/2018', ty: 'Báo cáo công tác tiếp dân, xử lý và giải quyết đơn thư khiếu nại, tố cáo tháng 5 năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 92 },
    { p: '049.jpg', so: '49/BC-UBND', d: '21/05/2018', ty: 'Báo cáo kết quả rà soát văn bản quy phạm pháp luật do HĐND, UBND xã ban hành', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 93 },
    { p: '050.jpg', so: '50/BC-UBND', d: '23/05/2018', ty: 'Báo cáo về việc đề xuất xử lý cơ sở nhà, đất của UBND xã Phú Lộc đang quản lý, sử dụng', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 97 },
    { p: '051.jpg', so: '51/BC-UBND', d: '23/05/2018', ty: 'Báo cáo kết quả thực hiện Chương trình mục tiêu Quốc gia giảm nghèo bền vững 6 tháng đầu năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 101 },
    { p: '052.jpg', so: '52/BC-UBND', d: '23/05/2018', ty: 'Báo cáo công tác cai nghiện và quản lý sau cai nghiện ma túy 6 tháng đầu năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 102 },
    { p: '053.jpg', so: '53/BC-UBND', d: '24/05/2018', ty: 'Báo cáo tiến độ lập quy hoạch xây dựng chi tiết khu trung tâm xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 104 },
    { p: '054.jpg', so: '54/BC-UBND', d: '24/05/2018', ty: 'Báo cáo tình hình thực hiện công tác thi hành án dân sự 6 tháng đầu năm 2018 và phương hướng nhiệm vụ 6 tháng cuối năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 105 },
    { p: '055.jpg', so: '55/BC-UBND', d: '28/05/2018', ty: 'Báo cáo tình hình hoạt động kinh tế tập thể 6 tháng đầu năm và phương hướng 6 tháng cuối năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 106 },
    { p: '056.jpg', so: '56/BC-UBND', d: '28/05/2018', ty: 'Báo cáo kết quả thực hiện công tác bảo hiểm y tế toàn dân 6 tháng đầu năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 107 },
    { p: '057.jpg', so: '57/BC-UBND', d: '28/05/2018', ty: 'Báo cáo về việc thực hiện bảo hiểm y tế đối với các đối tượng thuộc diện chính sách', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 109 },
    { p: '058.jpg', so: '58/BC-UBND', d: '28/05/2018', ty: 'Báo cáo kết quả thực hiện công tác đào tạo nghề cho lao động nông thôn 6 tháng đầu năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 110 },
    { p: '059.jpg', so: '59/BC-UBND', d: '28/05/2018', ty: 'Báo cáo công tác bảo vệ và chăm sóc trẻ em 6 tháng đầu năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 113 },
    { p: '060.jpg', so: '60/BC-UBND', d: '29/05/2018', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP 6 tháng đầu năm và nhiệm vụ trọng tâm 6 tháng cuối năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 117 },
    { p: '061.jpg', so: '61/BC-UBND', d: '29/05/2018', ty: 'Báo cáo kết quả thực hiện các kiến nghị sau giám sát của Ban Kinh tế - Xã hội HĐND xã', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 120 },
    { p: '062.jpg', so: '62/BC-UBND', d: '29/05/2018', ty: 'Báo cáo công tác quản lý đất đai, xây dựng, môi trường 6 tháng đầu năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 122 },
    { p: '063.jpg', so: '63/BC-UBND', d: '31/05/2018', ty: 'Báo cáo giải trình về các cơ sở chăn nuôi thuộc danh sách kiểm tra theo kế hoạch', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 123 },
    { p: '064.jpg', so: '64/BC-UBND', d: '31/05/2018', ty: 'Báo cáo kết quả điều tra thống kê, hoàn thiện hồ sơ các tiêu chí Nông thôn mới nâng cao năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 124 },
    { p: '065.jpg', so: '65/BC-UBND', d: '31/05/2018', ty: 'Báo cáo kết quả thực hiện chỉ tiêu 17.7 về tỷ lệ chất thải y tế được xử lý đạt chuẩn', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 125 },
    { p: '066.jpg', so: '66/BC-UBND', d: '31/05/2018', ty: 'Báo cáo kết quả thực hiện chỉ tiêu 17.1 về tỷ lệ hộ sử dụng nước hợp vệ sinh', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 126 },
    { p: '067.jpg', so: '67/BC-UBND', d: '31/05/2018', ty: 'Báo cáo giải trình về việc 01 hộ sản xuất kinh doanh chấp hành quy định bảo vệ môi trường', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 127 },
    { p: '068.jpg', so: '68/BC-UBND', d: '31/05/2018', ty: 'Báo cáo kết quả thực hiện chỉ tiêu 17.2 về Mô hình liên kết sản xuất và bảo vệ môi trường', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 128 },
    { p: '069.jpg', so: '69/BC-UBND', d: '01/06/2018', ty: 'Báo cáo kết quả điều tra thống kê, hoàn thiện hồ sơ các tiêu chí xã Nông thôn mới kiểu mẫu', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 129 },
    { p: '070.jpg', so: '70/BC-UBND', d: '01/06/2018', ty: 'Báo cáo rà soát điều chỉnh quy hoạch xây dựng Nông thôn mới giai đoạn 2016-2020', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 130 },
    { p: '071.jpg', so: '71/BC-UBND', d: '05/06/2018', ty: 'Báo cáo tự kiểm tra công tác văn thư, lưu trữ năm 2018 của UBND xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 132 },
    { p: '072.jpg', so: '72/BC-UBND', d: '14/06/2018', ty: 'Báo cáo kết quả triển khai thực hiện điều chỉnh các loại giấy tờ tùy thân của nhân dân', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 133 },
    { p: '073.jpg', so: '73/BC-UBND', d: '14/06/2018', ty: 'Báo cáo tình hình vi phạm trong quản lý đất đai trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 134 },
    { p: '074.jpg', so: '74/BC-UBND', d: '14/06/2018', ty: 'Báo cáo về việc phát triển du lịch và dịch vụ du lịch trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 135 },
    { p: '075.jpg', so: '75/BC-UBND', d: '14/06/2018', ty: 'Báo cáo tình hình thực hiện nhiệm vụ KTXH-ANQP tháng 06 năm 2018, phương hướng nhiệm vụ tháng 07 năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 139 },
    { p: '076.jpg', so: '76/BC-UBND', d: '12/06/2018', ty: 'Báo cáo kết quả tình trạng nạn nhân bị bạo lực giới và bạo lực gia đình năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 141 },
    { p: '077.jpg', so: '77/BC-UBND', d: '12/06/2018', ty: 'Báo cáo kết quả thống kê tình hình đăng ký, xử lý rác thải của các hộ dân', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 142 },
    { p: '078.jpg', so: '78/BC-UBND', d: '12/06/2018', ty: 'Báo cáo kết quả thực hiện chỉ tiêu 17.3 về môi trường trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 144 },
    { p: '079.jpg', so: '79/BC-UBND', d: '12/06/2018', ty: 'Báo cáo Kết quả thống kê hoàn thiện hồ sơ chứng minh Tiêu chí 17 Nông thôn mới', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 146 },
    { p: '080.jpg', so: '80/BC-UBND', d: '12/06/2018', ty: 'Báo cáo kết quả triển khai thực hiện phân loại rác tại nguồn năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 147 },
    { p: '081.jpg', so: '81/BC-UBND', d: '12/06/2018', ty: 'Báo cáo kết quả thực hiện chỉ tiêu 17.5 chất thải rắn trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 148 },
    { p: '082.jpg', so: '82/BC-UBND', d: '12/06/2018', ty: 'Báo cáo kết quả thống kê kiểm tra thu gom rác thải sinh hoạt trên địa bàn xã', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 149 },
    { p: '083.jpg', so: '83/BC-UBND', d: '15/06/2018', ty: 'Báo cáo tình hình triển khai và kết quả thực hiện Nghị quyết của HĐND xã về nhiệm vụ KTXH-ANQP', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 158 },
    { p: '084.jpg', so: '84/BC-UBND', d: '15/06/2018', ty: 'Báo cáo thực hiện thu nợ nguồn nhân dân đóng góp xây dựng đường GTNT', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 159 },
    { p: '085.jpg', so: '85/BC-UBND', d: '14/06/2018', ty: 'Báo cáo kết quả học tập của các em được nhận học bổng năm học 2017 - 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 160 },
    { p: '086.jpg', so: '86/BC-UBND', d: '13/06/2018', ty: 'Báo cáo kết quả đánh giá cải cách hành chính, kiểm soát thủ tục hành chính 6 tháng đầu năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 163 },
    { p: '087.jpg', so: '87/BC-UBND', d: '18/06/2018', ty: 'Báo cáo Quyết toán thu - chi ngân sách năm 2017, và báo cáo tình hình thu chi ngân sách 6 tháng đầu năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 169 },
    { p: '088.jpg', so: '88/BC-UBND', d: '18/06/2018', ty: 'BÁO CÁO Kết quả hoạt động tín dụng chính sách năm 2018 trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 171 },
    { p: '089.jpg', so: '89/BC-UBND', d: '19/06/2018', ty: 'Báo cáo rà soát các cơ sở nhà, đất bỏ trống không có nhu cầu sử dụng của UBND xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 172 },
    { p: '090.jpg', so: '90/BC-UBND', d: '19/06/2018', ty: 'Báo cáo kết quả thực hiện dự án nhân rộng mô hình giảm nghèo năm 2018', tg: 'Ban Chỉ đạo giảm nghèo Xã Phú Lộc', s: 174 },
    { p: '091.jpg', so: '51/BC-BVSTBCPN', d: '20/06/2018', ty: 'Báo cáo việc thực hiện công tác hoạt động vì sự tiến bộ của phụ nữ 6 tháng đầu năm 2018', tg: 'Ban Vì Sự Tiến Bộ Phụ Nữ Xã Phú Lộc', s: 177 },
    { p: '092.jpg', so: '91/BC-UBND', d: '20/06/2018', ty: 'Báo cáo kết quả thực hiện chỉ tiêu 18.7 thuộc tiêu chí số 18 về Hệ thống chính trị và tiếp cận pháp luật', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 178 },
    { p: '093.jpg', so: '92/BC-BCĐ', d: '20/06/2018', ty: 'Báo cáo kết quả thực hiện công tác phòng chống tham nhũng, lãng phí 6 tháng đầu năm 2018', tg: 'Ban Chỉ đạo PCTN Xã Phú Lộc', s: 181 },
    { p: '094.jpg', so: '94/BC-UBND', d: '22/06/2018', ty: 'Báo cáo công tác cấp, phát giấy CNQSDĐ và quản lý đất công 6 tháng đầu năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 182 },
    { p: '095.jpg', so: '95/BC-UBND', d: '25/06/2018', ty: 'Báo cáo về việc công tác tiếp dân và giải quyết đơn thư khiếu nại, tố cáo 6 tháng đầu năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 183 },
    { p: '096.jpg', so: '96/BC-UBND', d: '27/06/2018', ty: 'Báo cáo về việc không thực hiện việc mở rộng đường cặp hông chợ 5.5', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 184 },
    { p: '097.jpg', so: '97/BC-UBND', d: '27/06/2018', ty: 'Báo cáo kết quả thực hiện tiêu chí quy hoạch trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 186 },
    { p: '098.jpg', so: '98/BC-UBND', d: '27/06/2018', ty: 'Báo cáo tình hình quy hoạch nghĩa trang xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 187 },
    { p: '099.jpg', so: '99/BC-UBND', d: '27/06/2018', ty: 'Báo cáo kết quả thực hiện chỉ tiêu 17.4 mai táng phù hợp với quy định và theo quy hoạch', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 188 },
    { p: '100.jpg', so: '90a/BC-UBND', d: '28/06/2018', ty: 'Báo cáo kết quả thực hiện tiêu chí số 2 về đường giao thông nông thôn năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 189 },
    { p: '101.jpg', so: '93/BC-UBND', d: '29/06/2018', ty: 'Báo cáo kết quả thực hiện quy chế dân chủ 6 tháng đầu năm 2018 và phương hướng nhiệm vụ 6 tháng cuối năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 193, finalEnd: 200 }
  ];

  const activeRows = [];

  for (let i = 0; i < rawExcelData.length; i++) {
    const item = rawExcelData[i];
    const s = item.s;
    const nextStart = i < rawExcelData.length - 1 ? rawExcelData[i + 1].s : (item.finalEnd + 1);
    const end = nextStart - 1;
    const range = s === end ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')} - ${String(end).padStart(2, '0')}`;
    const loaiBan = 'Bản gốc';

    const newRow = {
      soTT: String(i + 1),
      soKyHieuVanBan: item.so,
      ngayThangVanBan: item.d,
      tenLoaiTrichYeu: item.ty,
      tacGiaVanBan: item.tg,
      toSoTrangSo: range,
      loaiBan: loaiBan,
      ghiChu: '',
      banGocChinh: loaiBan,
      banSao: '',
      doMat: '',
      sourceFileNames: item.p === '101.jpg' ? ['101.jpg', '102.jpg'] : [item.p]
    };
    activeRows.push(newRow);
  }

  // Update image 102.jpg metadata
  const img102 = job.images.find(img => img.fileName === '102.jpg');
  if (img102) {
    img102.status = 'merged';
    img102.mergeWith = '101.jpg';
    img102.notes = 'Trang 8/8 của Báo cáo 93/BC-UBND';
  }

  job.data.rows = activeRows;

  // Save updated job JSON
  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Updated job JSON for ${dosId}: ${activeRows.length} rows`);

  // Export to Excel Da_check and PL_outputOCR
  const daCheckExcel = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  const outputOcrExcel = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);

  await exportJsonToExcel(job, daCheckExcel);
  console.log(`Exported to ${daCheckExcel}`);

  await exportJsonToExcel(job, outputOcrExcel);
  console.log(`Exported to ${outputOcrExcel}`);
}

process18C().catch(err => {
  console.error('Error processing 18C:', err);
  process.exit(1);
});
