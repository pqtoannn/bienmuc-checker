import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function process18E() {
  const dosId = 'PL_2018_18E';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ Thông báo năm 2018 xã Phú Lộc (12/01/2018 đến 27/12/2018)';
  job.data.tieuDeNghiQuyet = 'Hồ sơ Thông báo năm 2018 xã Phú Lộc (12/01/2018 đến 27/12/2018)';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = '2018';
  job.data.tongSoToText = '';

  // Skip 001.jpg (folder cover)
  if (job.images && job.images[0]) {
    job.images[0].status = 'skip';
    job.images[0].isExcluded = true;
    job.images[0].skipReason = 'Bìa hồ sơ';
  }

  const rawExcelData = [
    { p: '002.jpg', so: '01/TB-UBND', d: '12/01/2018', ty: 'Thông báo về việc giải tỏa hành lang an toàn giao thông đường bộ', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 1 },
    { p: '003.jpg', so: '02/TB-UBND', d: '15/01/2018', ty: 'Thông báo về việc mức đóng góp tiền điện đèn đường chiếu sáng các tuyến đường', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 2 },
    { p: '004.jpg', so: '03/TB-UBND', d: '22/01/2018', ty: 'Thông báo tham gia huấn luyện Điều lệnh đội ngũ năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 3 },
    { p: '005.jpg', so: '04/TB-UBND', d: '22/01/2018', ty: 'Thông báo về việc kiểm tra tình hình thực hiện công tác bảo vệ môi trường tại các cơ sở, trang trại chăn nuôi, các hộ gia đình có hoạt động chăn nuôi trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 4 },
    { p: '006.jpg', so: '06/KH-HĐNVQS', d: '26/01/2018', ty: 'Thông báo phân công thành viên Hội đồng NVQS xã phụ trách thực hiện công tác tuyển quân năm 2018', tg: 'Hội đồng NVQS xã Phú Lộc', s: 5 },
    { p: '007.jpg', so: '05/TB-UBND', d: '30/01/2018', ty: 'Thông báo về việc nghỉ lễ, treo cờ tết Nguyên Đán Mậu Tuất năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 7 },
    { p: '008.jpg', so: '06/TB-UBND', d: '01/02/2018', ty: 'Thông báo về việc phân công trực tết Nguyên đán Mậu Tuất năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 8 },
    { p: '009.jpg', so: '02/TB-UBND', d: '05/02/2018', ty: 'Thông báo về việc tổ chức giao lưu đêm văn nghệ Mừng Đảng – Mừng Xuân Mậu Tuất năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 10 },
    { p: '010.jpg', so: '08/TB-HĐ.NVQS', d: '05/02/2018', ty: 'Thông báo về việc gọi công dân trúng tuyển nhận lệnh gọi nhập ngũ, thực hiện nghĩa vụ tham gia công an nhân dân năm 2018', tg: 'Hội đồng NVQS xã Phú Lộc', s: 11 },
    { p: '011.jpg', so: '09/TB-HĐ.NVQS', d: '12/02/2018', ty: 'Thông báo về việc gọi công dân nhập ngũ nghĩa vụ quân sự và nghĩa vụ công an nhân dân năm 2018', tg: 'Hội đồng NVQS xã Phú Lộc', s: 12 },
    { p: '012.jpg', so: '10/TB-UBND', d: '26/02/2018', ty: 'Thông báo về việc chấm hộ cung cố hồ sơ liên quan đến giao dịch đảm bảo bằng quyền sử dụng đất, tài sản gắn liền với đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 13 },
    { p: '013.jpg', so: '17/TB-UBND', d: '07/03/2018', ty: 'Thông báo về việc kết quả giải quyết đơn xin giảm tiền đóng góp xã hội hóa giao thông nông thôn các tuyến đường bê tông trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 14, loaiBan: 'Photo' },
    { p: '014.jpg', so: '11/TB-UBND', d: '14/03/2018', ty: 'Thông báo về việc mất giấy trang bổ sung trong giấy chứng nhận QSD đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 15 },
    { p: '015.jpg', so: '14/TB-UBND', d: '26/03/2018', ty: 'Thông báo về việc giải quyết đơn khiếu kiện ngộ độc hóa chất của bà Trịnh Thị Hồng Hạnh ấp 3 xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 17 },
    { p: '016.jpg', so: '12/TB-UBND', d: '31/03/2018', ty: 'Thông báo về việc trả lời ý kiến của HTX Lộc Phát', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 18 },
    { p: '017.jpg', so: '15/TB-UBND', d: '21/03/2018', ty: 'Thông báo giải quyết đơn về việc chưa nhận hỗ trợ hạn hán năm 2015-2016', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 19 },
    { p: '018.jpg', so: '15/TB-UBND', d: '02/04/2018', ty: 'Thông báo về việc tuyển sinh quân sự năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 20 },
    { p: '019.jpg', so: '15/TB-BCĐ', d: '02/04/2018', ty: 'Thông báo phân công nhiệm vụ các thành viên Ban chỉ đạo nông nghiệp nông dân nông thôn và xây dựng nông thôn mới', tg: 'Ban Chỉ đạo NN-ND-NT & XD.NTM', s: 21 },
    { p: '020.jpg', so: '16/TB-UBND', d: '03/04/2018', ty: 'Thông báo về việc mất giấy trang bổ sung giấy chứng nhận quyền sử dụng đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 27 },
    { p: '021.jpg', so: '17/TB-UBND', d: '03/04/2018', ty: 'Thông báo về việc mất giấy trang bổ sung trong giấy chứng nhận quyền sử dụng đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 28 },
    { p: '022.jpg', so: '18/TB-UBND', d: '05/04/2018', ty: 'Thông báo chiêu sinh huấn luyện dân quân Công binh năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 29 },
    { p: '023.jpg', so: '19/TB-UBND', d: '03/04/2018', ty: 'Thông báo giải quyết đơn về việc chưa nhận hỗ trợ hạn hán năm 2015 - 2016 của hộ bà Đặng Thị Lại thường trú tại ấp 2 xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 30 },
    { p: '024.jpg', so: '20/TB-UBND', d: '15/04/2018', ty: 'Thông báo về việc ủy quyền điều hành hoạt động cơ quan', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 31 },
    { p: '025.jpg', so: '21/TB-UBND', d: '23/04/2018', ty: 'Thông báo về việc nghỉ lễ, treo cờ ngày giải phóng miền Nam (30/4) và Quốc tế Lao động (01/5) năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 32 },
    { p: '026.jpg', so: '22/TB-UBND', d: '25/04/2018', ty: 'Thông báo Lịch trực lễ ngày Giỗ Tổ Hùng Vương năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 33 },
    { p: '027.jpg', so: '23/TB-UBND', d: '23/04/2018', ty: 'Thông báo Lịch trực lễ ngày giải phóng hoàn toàn miền nam (30/4) và Quốc tế Lao động (1/5) năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 34 },
    { p: '028.jpg', so: '24/TB-UBND', d: '24/04/2018', ty: 'Thông báo về việc mất giấy chứng nhận quyền sử dụng đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 35 },
    { p: '029.jpg', so: '19/TB-HĐNVQS', d: '25/04/2018', ty: 'Thông báo về việc phân công các đồng chí thành viên Hội đồng Nghĩa vụ quân sự xã phụ trách chỉ đạo công tác đăng ký Nghĩa vụ quân sự lần đầu năm 2018', tg: 'Hội đồng NVQS xã Phú Lộc', s: 36 },
    { p: '030.jpg', so: '25/TB-UBND', d: '08/05/2018', ty: 'Thông báo về số điện thoại Tổng đài Quốc gia bảo vệ trẻ em 111', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 37 },
    { p: '031.jpg', so: '26/TB-UBND', d: '08/05/2018', ty: 'Thông báo về việc triển khai dịch vụ công trực tuyến mức độ 3 và dịch vụ bưu chính công ích', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 39 },
    { p: '032.jpg', so: '26/TB-UBND', d: '15/05/2018', ty: 'Thông báo về việc xây dựng tuyến đường “Sáng – xanh – sạch – đẹp” trên địa bàn xã năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 41 },
    { p: '033.jpg', so: '27/TB-UBND', d: '15/05/2018', ty: 'Thông báo về việc vận động mua BHYT tự nguyện trong cán bộ, công chức, các ban ngành đoàn thể, bí thư chi bộ, trưởng các ấp', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 42 },
    { p: '034.jpg', so: '28/TB-HĐ.GDQP&AN', d: '16/05/2018', ty: 'Thông báo về việc chiêu sinh cán bộ, công chức, viên chức tham gia lớp bồi dưỡng kiến thức Quốc phòng và An ninh cho đối tượng 4 năm 2018', tg: 'Hội đồng GDQP&AN xã Phú Lộc', s: 43 },
    { p: '035.jpg', so: '29/TB-UBND', d: '22/05/2018', ty: 'Thông báo về việc dự lễ tổng kết năm học 2017 - 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 45 },
    { p: '036.jpg', so: '30/TB-UBND', d: '22/05/2018', ty: 'Thông báo thời gian làm việc, tiêu chuẩn và nhiệm vụ của chức danh Chủ tịch Hội Chữ Thập đỏ xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 46 },
    { p: '037.jpg', so: '31/TB-UBND', d: '28/05/2018', ty: 'Thông báo thời gian và địa điểm tiếp xúc cử tri trước kỳ họp thứ 6 HĐND xã khóa V, nhiệm kỳ 2016-2021', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 47 },
    { p: '038.jpg', so: '32/TB-UBND', d: '28/05/2018', ty: 'Thông báo về việc bảo vệ môi trường', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 48 },
    { p: '039.jpg', so: '33/TB-UBND', d: '15/06/2018', ty: 'Thông báo về việc phân công trực theo Công văn của Thường trực Huyện ủy Tân Phú', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 50 },
    { p: '040.jpg', so: '34/TB-UBND', d: '15/06/2018', ty: 'Thông báo về việc mất giấy trang bổ sung trong giấy chứng nhận QSD đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 51 },
    { p: '041.jpg', so: '34/TB-UBND', d: '15/06/2018', ty: 'Thông báo về việc mất giấy trang bổ sung trong giấy chứng nhận QSD đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 52 },
    { p: '042.jpg', so: '35/TB-UBND', d: '22/06/2018', ty: 'Thông báo về việc rà soát những người hoạt động không chuyên trách công tác tại UBND xã từ tháng 4/2017 đến nay', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 53 },
    { p: '043.jpg', so: '36/TB-UBND', d: '25/06/2018', ty: 'Thông báo về việc điều chỉnh thẻ BHYT năm 2018 cho nhân dân thuộc xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 54 },
    { p: '044.jpg', so: '37/TB-UBND', d: '26/06/2018', ty: 'Thông báo về việc mất giấy chứng nhận quyền sử dụng đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 55 },
    { p: '045.jpg', so: '38/TB-UBND', d: '26/06/2018', ty: 'Thông báo về việc mất trang bổ sung giấy chứng nhận quyền sử dụng đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 56 },
    { p: '046.jpg', so: '39/TB-UBND', d: '27/06/2018', ty: 'Thông báo thời gian và địa điểm tiếp xúc cử tri sau kỳ họp thứ 6 HĐND xã khóa V, nhiệm kỳ 2016-2021', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 57 },
    { p: '047.jpg', so: '40/TB-UBND', d: '02/07/2018', ty: 'Thông báo giải quyết đơn về việc hỗ trợ rủi ro thiên tai dịch bệnh cây trồng nông nghiệp trên địa bàn xã Phú Lộc năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 58 },
    { p: '048.jpg', so: '41/TB-UBND', d: '04/07/2018', ty: 'Thông báo về việc ủy quyền điều hành hoạt động cơ quan', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 59 },
    { p: '049.jpg', so: '42/TB-UBND', d: '06/07/2018', ty: 'Thông báo về việc mất giấy trang bổ sung trong giấy chứng nhận QSD đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 60 },
    { p: '050.jpg', so: '43/TB-UBND', d: '10/07/2018', ty: 'Thông báo về việc chi trả phụ cấp cho Ban chấp hành các chi hội ấp', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 61 },
    { p: '051.jpg', so: '44/TB-UBND', d: '11/07/2018', ty: 'Thông báo Kết luận của Đồng chí Chủ tịch UBND xã tại cuộc họp giao ban tháng 7 năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 62 },
    { p: '052.jpg', so: '45/TB-UBND', d: '12/07/2018', ty: 'Thông báo về việc tổ chức lớp dạy bơi cho trẻ em có hoàn cảnh khó khăn trên địa bàn xã Phú Lộc năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 64 },
    { p: '053.jpg', so: '46/TB-UBND', d: '13/07/2018', ty: 'Thông báo về việc chuyển hồ sơ', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 65 },
    { p: '054.jpg', so: '47/TB-UBND', d: '19/07/2018', ty: 'Thông báo về việc phân công trả lời ý kiến Đại biểu HĐND huyện tại kỳ họp thứ 6 HĐND huyện khóa VI', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 66 },
    { p: '055.jpg', so: '48/TB-UBND', d: '23/07/2018', ty: 'Thông báo về việc mất giấy trang bổ sung trong giấy chứng nhận QSD đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 67 },
    { p: '056.jpg', so: '49/TB-UBND', d: '23/07/2018', ty: 'Thông báo về việc chủ động phòng chống dịch bệnh gia súc, gia cầm', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 68 },
    { p: '057.jpg', so: '48/TB-UBND', d: '25/07/2018', ty: 'Thông báo về việc xây dựng tuyến đường sáng, xanh, sạch, đẹp năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 69 },
    { p: '058.jpg', so: '50/TB-UBND', d: '30/07/2018', ty: 'Thông báo kết luận của Đồng chí Chủ tịch UBND xã tại cuộc họp giao ban công tác tháng 8/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 70 },
    { p: '059.jpg', so: '52/TB-UBND', d: '16/08/2018', ty: 'Thông báo về việc người chấp hành án phạt tù cho hưởng án treo', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 71 },
    { p: '060.jpg', so: '53/TB-UBND', d: '16/08/2018', ty: 'Thông báo về việc phân công trả lời ý kiến cử tri tại kỳ họp thứ 6 HĐND xã khóa V', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 72 },
    { p: '061.jpg', so: '54/TB-HĐNVQS', d: '17/08/2018', ty: 'Thông báo thời gian và địa điểm tổ chức xét duyệt tiêu chuẩn tuyển chọn công dân nhập ngũ và tham gia Công an nhân dân năm 2019', tg: 'Hội đồng NVQS xã Phú Lộc', s: 73 },
    { p: '062.jpg', so: '55/TB-UBND', d: '20/08/2018', ty: 'Thông báo về việc kiểm tra tình hình thực hiện công tác bảo vệ môi trường đối với các hộ gia đình chăn nuôi gia súc, gia cầm trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 74 },
    { p: '063.jpg', so: '44/TB-HĐNV', d: '24/08/2018', ty: 'Thông báo thời gian và địa điểm tổ chức xét duyệt tiêu chuẩn tuyển chọn công dân nhập ngũ và thực hiện nghĩa vụ tham gia CAND năm 2019', tg: 'Hội đồng NVQS xã Phú Lộc', s: 75 },
    { p: '064.jpg', so: '56/TB-UBND', d: '23/08/2018', ty: 'Thông báo về việc mất giấy chứng nhận quyền sử dụng đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 76 },
    { p: '065.jpg', so: '57/TB-UBND', d: '27/08/2018', ty: 'Thông báo về việc nghỉ lễ, treo cờ ngày Quốc Khánh 02/9 năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 77 },
    { p: '066.jpg', so: '58/TB-UBND', d: '28/08/2018', ty: 'Thông báo về việc phân công Cán bộ, công nhân viên trực ngày Quốc khánh 02/9/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 78 },
    { p: '067.jpg', so: '57/TB-HĐ.NVQS', d: '29/08/2018', ty: 'Thông báo thời gian và địa điểm tổ chức xét duyệt tiêu chuẩn chính trị, đạo đức gọi công dân nhập ngũ năm 2019', tg: 'Hội đồng NVQS xã Phú Lộc', s: 79 },
    { p: '068.jpg', so: '59/TB-UBND', d: '04/09/2018', ty: 'Thông báo về việc dự lễ khai giảng năm học 2018 - 2019', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 81 },
    { p: '069.jpg', so: '60/TB-UBND', d: '18/09/2018', ty: 'Thông báo về việc tăng cường bảo đảm an toàn thực phẩm Tết Trung thu năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 82 },
    { p: '070.jpg', so: '61/TB-UBND', d: '20/09/2018', ty: 'Thông báo về việc tạm ngừng hoạt động đài truyền thanh xã', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 83 },
    { p: '071.jpg', so: '62/TB-UBND', d: '21/09/2018', ty: 'Thông báo kết luận của Đồng chí CT. UBND xã tại cuộc họp giao ban công tác tháng 9 năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 84 },
    { p: '072.jpg', so: '63/TB-UBND', d: '24/09/2018', ty: 'Thông báo về việc mất trang bổ sung giấy chứng nhận QSD đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 86 },
    { p: '073.jpg', so: '65/TB-UBND', d: '25/10/2018', ty: 'Thông báo về việc hỗ trợ công trình đường giao thông nông thôn và kênh mương nội đồng năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 87 },
    { p: '074.jpg', so: '66/TB-UBND', d: '26/10/2018', ty: 'Thông báo về việc mất giấy trang bổ sung trong giấy chứng nhận QSD đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 88 },
    { p: '075.jpg', so: '67/TB-UBND', d: '09/11/2018', ty: 'Thông báo kết luận của Đồng chí Chủ tịch UBND xã tại cuộc họp giao ban công tác tháng 11 năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 89 },
    { p: '076.jpg', so: '68/TB-UBND', d: '09/11/2018', ty: 'Thông báo về việc thu hồi tiền hỗ trợ đối tượng chính sách người có công dịp Tết nguyên đán năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 91 },
    { p: '077.jpg', so: '69/TB-UBND', d: '12/11/2018', ty: 'Thông báo về việc giải tỏa hành lang an toàn giao thông đường bộ', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 92 },
    { p: '078.jpg', so: '40/TB-HĐNVQS', d: '12/11/2018', ty: 'Thông báo về việc gửi giấy xác nhận, biên lai thu tiền học phí đối với các công dân đang học tập tại các trường thuộc diện tạm hoãn gọi nhập ngũ năm 2019', tg: 'Hội đồng NVQS xã Phú Lộc', s: 93 },
    { p: '079.jpg', so: '70/TB-HĐNVQS', d: '12/11/2018', ty: 'Thông báo danh sách nam công dân trong độ tuổi sẵn sàng nhập ngũ khám sức khỏe tuyển chọn, gọi công dân nhập ngũ năm 2019', tg: 'Hội đồng NVQS xã Phú Lộc', s: 94 },
    { p: '080.jpg', so: '71/TB-UBND', d: '19/11/2018', ty: 'Thông báo về việc dự lễ ngày Nhà giáo Việt Nam 20/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 95 },
    { p: '081.jpg', so: '72/TB-UBND', d: '22/11/2018', ty: 'Thông báo lịch trực cơn bão số 09/2018 Ban chỉ huy PCTT&TKCN xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 96 },
    { p: '082.jpg', so: '73/TB-PCTT', d: '23/11/2018', ty: 'Thông báo về việc chủ động theo dõi diễn biến cơn bão số 9', tg: 'Ban Chỉ huy PCTT-TKCN UBND Xã Phú Lộc', s: 97 },
    { p: '083.jpg', so: '74/TB-UBND', d: '26/11/2018', ty: 'Thông báo về việc mất giấy chứng nhận quyền sử dụng đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 98 },
    { p: '084.jpg', so: '75/TB-UBND', d: '27/11/2018', ty: 'Thông báo về việc phân bổ và lập dự toán năm 2019 các đơn vị trường học', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 99 },
    { p: '085.jpg', so: '76/TB-UBND', d: '06/12/2018', ty: 'Thông báo về việc phân công dọn vệ sinh khuôn viên đài tưởng niệm xã', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 100 },
    { p: '086.jpg', so: '77/TB-UBND', d: '10/12/2018', ty: 'Thông báo về việc mất giấy chứng nhận quyền sử dụng đất', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 101 },
    { p: '087.jpg', so: '78/TB-HDNV', d: '10/12/2018', ty: 'Thông báo thời gian và địa điểm tổ chức bình cử, công khai tuyển chọn, gọi công dân nhập ngũ năm 2019', tg: 'Hội đồng NVQS xã Phú Lộc', s: 102 },
    { p: '088.jpg', so: '79/TB-UBND', d: '10/12/2018', ty: 'Thông báo về việc trả lời ý kiến cử tri sau kỳ họp thứ 6 HĐND xã khóa V, nhiệm kỳ 2016-2021', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 103 },
    { p: '089.jpg', so: '80/TB-HĐNVQS', d: '11/12/2018', ty: 'Thông báo về việc công dân trúng tuyển nghĩa vụ quân sự và công an nhân dân năm 2019', tg: 'Hội đồng NVQS xã Phú Lộc', s: 106 },
    { p: '090.jpg', so: '81/TB-UBND', d: '14/12/2018', ty: 'Thông báo về việc trả lời ý kiến cử tri trước kỳ họp thứ 8 HĐND xã khóa V, nhiệm kỳ 2016-2021', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 107 },
    { p: '091.jpg', so: '82/TB-UBND', d: '17/12/2018', ty: 'Thông báo kết quả họp xét đánh giá, phân loại Cán bộ, công chức năm 2018', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 109 },
    { p: '092.jpg', so: '83/TB-UBND', d: '19/12/2018', ty: 'Thông báo về việc hạn chế chi VPP và quy trình thanh toán chứng từ', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 111 },
    { p: '093.jpg', so: '84/TB-UBND', d: '18/12/2018', ty: 'Thông báo về việc giải tỏa, tháo gỡ mái che, mái hiên, biển quảng cáo sai quy định', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 112 },
    { p: '094.jpg', so: '85/TB-UBND', d: '27/12/2018', ty: 'Thông báo về việc phân công trực Tết Dương lịch năm 2019', tg: 'Ủy ban nhân dân xã Phú Lộc', s: 113, finalEnd: 113 }
  ];

  const activeRows = [];

  for (let i = 0; i < rawExcelData.length; i++) {
    const item = rawExcelData[i];
    const s = item.s;
    const nextStart = i < rawExcelData.length - 1 ? rawExcelData[i + 1].s : (item.finalEnd + 1);
    const end = nextStart - 1;
    const range = s === end ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')} - ${String(end).padStart(2, '0')}`;
    const loaiBan = item.loaiBan || 'Bản gốc';

    const newRow = {
      soTT: String(i + 1),
      soKyHieuVanBan: item.so,
      ngayThangVanBan: item.d,
      tenLoaiTrichYeu: item.ty,
      tacGiaVanBan: item.tg,
      toSoTrangSo: range,
      loaiBan: loaiBan,
      ghiChu: '',
      banGocChinh: loaiBan.includes('gốc') || loaiBan.includes('chính') ? loaiBan : '',
      banSao: loaiBan.includes('sao') || loaiBan.includes('Photo') ? loaiBan : '',
      doMat: '',
      sourceFileNames: [item.p]
    };
    activeRows.push(newRow);
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

  // Sync Photo rows to Tl_loại_VP_Toàn_PL.xlsx
  console.log(`Syncing Photo rows in ${dosId} to Tl_loại_VP_Toàn_PL.xlsx...`);
  for (const r of activeRows) {
    if (r.loaiBan === 'Photo' || r.loaiBan === 'Bản sao') {
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

process18E().catch(err => {
  console.error('Error processing 18E:', err);
  process.exit(1);
});
