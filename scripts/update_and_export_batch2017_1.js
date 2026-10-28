import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function processDossier(config) {
  const { dosId, title, year, skipFiles, rowsConfig, syncPhotos } = config;
  console.log(`Processing ${dosId}...`);

  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = title;
  job.data.tieuDeNghiQuyet = title;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = year;
  job.data.tongSoToText = '';

  // Mark skipped images
  if (job.images) {
    job.images.forEach(im => {
      if (skipFiles.includes(im.fileName)) {
        im.status = 'skip';
        im.isExcluded = true;
        im.skipReason = 'Bìa hồ sơ hoặc tờ chốt đính kèm';
      }
    });
  }

  const activeRows = [];
  for (let i = 0; i < rowsConfig.length; i++) {
    const rc = rowsConfig[i];
    const origRow = job.data.rows.find(r => r.sourceFileNames && r.sourceFileNames.includes(rc.p)) || {};

    let so = rc.so !== undefined ? rc.so : (origRow.soKyHieuVanBan || '');
    let d = rc.d !== undefined ? rc.d : (origRow.ngayThangVanBan || '');
    let tg = rc.tg !== undefined ? rc.tg : (origRow.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc');
    let ty = rc.ty !== undefined ? rc.ty : (origRow.tenLoaiTrichYeu || '');
    let loaiBan = rc.loaiBan || origRow.loaiBan || 'Bản gốc';

    if (tg.toLowerCase().includes('uỷ')) {
      tg = tg.replace(/uỷ/g, 'ủy').replace(/Uỷ/g, 'Ủy');
    }

    activeRows.push({
      soTT: String(i + 1),
      soKyHieuVanBan: so,
      ngayThangVanBan: d,
      tenLoaiTrichYeu: ty,
      tacGiaVanBan: tg,
      toSoTrangSo: rc.toSo,
      loaiBan: loaiBan,
      ghiChu: '',
      banGocChinh: loaiBan.includes('gốc') || loaiBan.includes('chính') ? loaiBan : '',
      banSao: loaiBan.includes('sao') || loaiBan.includes('Photo') ? loaiBan : '',
      doMat: '',
      sourceFileNames: rc.files || [rc.p]
    });
  }

  job.data.rows = activeRows;
  job.data.rowsTrung = [];

  // Save updated job.json
  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  // Export to Excel in PL_outputOCR
  const outExcelOcr = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  await exportJsonToExcel(job, outExcelOcr);

  // Export to Excel in Da_check
  const outExcelDaCheck = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  await exportJsonToExcel(job, outExcelDaCheck);

  console.log(`Saved & Exported ${dosId} (${activeRows.length} rows)`);

  // Sync Photos
  if (syncPhotos && syncPhotos.length > 0) {
    for (const sp of syncPhotos) {
      await appendTaiLieuLoai({
        type: 'photo',
        tenVanBan: sp.ty,
        soHoSo: dosId,
        thbq: 'Vĩnh viễn'
      });
      console.log(`Synced Photo doc to Tl_loại: '${sp.ty.slice(0, 40)}'`);
    }
  }
}

async function run() {
  // 1. PL_2017_17A
  await processDossier({
    dosId: 'PL_2017_17A',
    title: 'Hồ sơ Quyết định xử phạt vi phạm hành chính năm 2017 xã Phú Lộc (05/12/2017 đến 21/12/2017)',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: [
      { p: '002.jpg', so: '01/QĐ-UBND', d: '05/12/2017', ty: 'Quyết định Xử phạt vi phạm hành chính trong lĩnh vực Đất đai, ông Nguyễn Văn Hòa và bà Nguyễn Thị Bạch Tuyết', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '01', loaiBan: 'Bản gốc' },
      { p: '003.jpg', so: '02/QĐ-UBND', d: '21/12/2017', ty: 'Quyết định xử phạt vi phạm hành chính trong lĩnh vực Đất đai, bà Phan Thị Diễm Trang', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '02', loaiBan: 'Bản gốc' }
    ]
  });

  // 2. PL_2017_17B
  await processDossier({
    dosId: 'PL_2017_17B',
    title: 'Hồ sơ Văn bản các loại (Giấy mời, chương trình, bảng đăng ký, hợp đồng, đơn xin nghỉ việc) năm 2017 xã Phú Lộc (20/02/2017 đến 22/05/2017)',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: [
      { p: '002.jpg', so: '', d: '20/02/2017', ty: 'Giấy mời họp đánh giá tình hình thực hiện thu XHHGT trong tháng qua và triển khai phương hướng nhiệm vụ thực hiện trong tháng tới', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '01 - 02', loaiBan: 'Bản gốc' },
      { p: '003.jpg', so: '', d: '09/03/2017', ty: 'Chương trình Lễ khai mạc, bế mạc Đại hội TDTT xã Phú Lộc lần thứ V năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '03 - 04', loaiBan: 'Bản gốc' },
      { p: '004.jpg', so: '', d: '22/05/2017', ty: 'Bảng đăng ký thực hiện mô hình "Dân vận khéo" năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '05', loaiBan: 'Bản gốc' },
      { p: '005.jpg', so: '16/CCT-HĐ', d: '01/01/2017', ty: 'Hợp đồng uỷ nhiệm thu thuế', tg: 'Chi cục Thuế Tân Phú', toSo: '06 - 08', loaiBan: 'Bản gốc' },
      { p: '006.jpg', so: '', d: '15/05/2017', ty: 'Đơn xin nghỉ việc, bà Nguyễn Thị Yến Nhi', tg: 'Bà Nguyễn Thị Yến Nhi', toSo: '09', loaiBan: 'Bản gốc' }
    ]
  });

  // 3. PL_2017_17C
  await processDossier({
    dosId: 'PL_2017_17C',
    title: 'Hồ sơ Bảng phân công, bảng thống kê, biểu tổng hợp năm 2017 xã Phú Lộc (17/01/2017 đến 07/11/2017)',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: [
      { p: '002.jpg', so: '01/BPC-UBND', d: '17/01/2017', ty: 'Bảng phân công thành viên UBND xã điều hành nhiệm vụ KTXH - ANQP trong năm 2017 và phân công nhiệm vụ công chức và không chuyên trách của xã', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '01 - 06', loaiBan: 'Bản gốc' },
      { p: '003.jpg', so: '02/BPC-UBND', d: '27/03/2017', ty: 'Bản phân công nhiệm vụ cán bộ, công nhân viên, thành viên BCĐ trong ngày lễ công bố xã đạt chuẩn nông thôn mới', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '07', loaiBan: 'Bản gốc' },
      { p: '004.jpg', so: '', d: '12/05/2017', ty: 'Bảng phân công các thành viên Ban tổ chức Đại hội thể dục thể thao xã Phú Lộc lần thứ V năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '08 - 09', loaiBan: 'Bản gốc' },
      { p: '005.jpg', so: '03/BPC-UBND', d: '30/05/2017', ty: 'Bảng phân công nhiệm vụ xây dựng báo cáo phục vụ kỳ họp thứ IV-HĐND khóa VI, nhiệm kỳ 2016-2021', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '10', loaiBan: 'Bản gốc' },
      { p: '006.jpg', so: '04/BPC-UBND', d: '02/06/2017', ty: 'Bảng phân công thời gian, địa điểm Chủ tịch và Phó chủ tịch dự tiếp xúc cử tri trước kỳ họp thứ 6 Đại biểu HĐND xã khóa VI nhiệm kỳ 2016-2021', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '11', loaiBan: 'Bản gốc' },
      { p: '007.jpg', so: '04/BPC-UBND', d: '25/07/2017', ty: 'Bảng phân công trả lời ý kiến Đại biểu HĐND phụ trách các ấp phục vụ kỳ họp thứ VI-HĐND xã khóa VI, nhiệm kỳ 2016-2021', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '12', loaiBan: 'Bản gốc' },
      { p: '008.jpg', so: '', d: '', ty: 'Bảng thống kê chất lượng công chức cấp xã 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '13 - 19', loaiBan: 'Bản gốc' },
      { p: '009.jpg', so: '', d: '22/10/2017', ty: 'Biểu tổng hợp kết quả trúng cử trưởng ấp, khu phố lần thứ VIII, nhiệm kỳ 2017-2020', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '20', loaiBan: 'Bản gốc' },
      { p: '010.jpg', so: '02/BPC-UBND', d: '07/11/2017', ty: 'Bảng phân công nhiệm vụ xây dựng báo cáo phục vụ kỳ họp thứ VII-HĐND khóa VI, nhiệm kỳ 2016-2021', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '21 - 25', loaiBan: 'Bản gốc' },
      { p: '011.jpg', so: '', d: '18/11/2016', ty: 'Bảng tổng hợp kết quả lấy ý kiến cử tri về đề án chia tách, sáp nhập ấp, khu phố trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '26', loaiBan: 'Bản gốc' }
    ]
  });

  // 4. PL_2017_17G
  await processDossier({
    dosId: 'PL_2017_17G',
    title: 'Hồ sơ về Kỷ cương hành chính, đạo đức công vụ năm 2017 xã Phú Lộc (05/01/2017 đến 28/02/2017)',
    year: '2017',
    skipFiles: ['001.jpg'],
    syncPhotos: [
      { ty: 'Quyết định về việc thành lập Tổ kiểm tra cải cách hành chính năm 2015' }
    ],
    rowsConfig: [
      { p: '002.jpg', so: '04/KH-UBND', d: '05/01/2017', ty: 'Kế hoạch thực hiện năm “KỶ CƯƠNG HÀNH CHÍNH, ĐẠO ĐỨC CÔNG VỤ” trong thi hành nhiệm vụ của Cán Bộ, công chức xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '01 - 03', loaiBan: 'Bản gốc' },
      { p: '003.jpg', so: '08/TB-TKT', d: '09/02/2017', ty: 'Thông báo về việc tăng cường công tác kiểm tra việc chấp hành kỷ luật, kỷ cương hành chính, đạo đức công vụ tại xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '04 - 05', loaiBan: 'Bản chính' },
      { p: '004.jpg', so: '21/QĐ-UBND', d: '09/02/2015', ty: 'Quyết định về việc thành lập Tổ kiểm tra cải cách hành chính năm 2015', tg: 'Ủy ban nhân dân huyện Tân Phú', toSo: '06 - 07', loaiBan: 'Photo' },
      { p: '005.jpg', so: '23/QĐ-UBND', d: '11/02/2015', ty: 'Quyết định về việc thành lập tổ kiểm tra "KỶ CƯƠNG HÀNH CHÍNH, ĐẠO ĐỨC, CÔNG VỤ" đối với cán bộ, công chức xã Phú Lộc, ông Nguyễn Tấn Hiệp, ông Nguyễn Ngọc Tú, bà Huỳnh Thị Ngọc Bích', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '08', loaiBan: 'Bản chính' },
      { p: '006.jpg', so: '', d: '', ty: 'Biên bản kiểm tra', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '09 - 13', loaiBan: 'Bản gốc' },
      { p: '007.jpg', so: '265/UBND-NC', d: '28/02/2017', ty: 'Công văn về việc kiểm tra công tác cải cách hành chính, kiểm tra công vụ', tg: 'Ủy ban nhân dân huyện Tân Phú', toSo: '14', loaiBan: 'Bản gốc' },
      { p: '008.jpg', so: '', d: '', ty: 'Phiếu chuyển về nội dung giao đ/c Bích CCVP rà soát lại theo mục 1, gửi các đ/c phòng 1Cửa biết cùng tham gia trong giao ban', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '15', loaiBan: 'Bản gốc' }
    ]
  });

  // 5. PL_2017_17K
  await processDossier({
    dosId: 'PL_2017_17K',
    title: 'Hồ sơ Chương trình công tác và Thông báo Lịch làm việc tuần năm 2017 xã Phú Lộc (05/01/2017 đến 05/06/2017)',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: [
      { p: '002.jpg', so: '01/CTr-UBND', d: '05/01/2017', ty: 'Chương trình thực hành tiết kiệm, chống lãng phí năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '01 - 03', loaiBan: 'Bản gốc' },
      { p: '003.jpg', so: '01/CTr-UBND', d: '14/01/2017', ty: 'Chương trình công tác quý I của Ủy ban nhân dân xã Phú Lộc năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '04 - 05', loaiBan: 'Bản gốc' },
      { p: '004.jpg', so: '02/CTr-UBND', d: '30/03/2017', ty: 'Chương trình công tác quý II của Ủy ban nhân dân xã Phú Lộc năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '06 - 08', loaiBan: 'Bản gốc' },
      { p: '005.jpg', so: '02/TB-UBND', d: '06/02/2017', ty: 'Thông báo lịch làm việc tuần của Đảng ủy - HĐND - UBND xã (Từ ngày 06 tháng 02 đến ngày 11 tháng 02 năm 2017)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '09', loaiBan: 'Bản gốc' },
      { p: '006.jpg', so: '03/TB-UBND', d: '20/02/2017', ty: 'Thông báo lịch làm việc tuần của Đảng ủy - HĐND - UBND xã (Từ ngày 20 tháng 02 đến ngày 26 tháng 02 năm 2017)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '10', loaiBan: 'Bản gốc' },
      { p: '007.jpg', so: '06/TB-UBND', d: '06/03/2017', ty: 'Thông báo lịch làm việc tuần của Đảng ủy - HĐND - UBND xã (Từ ngày 06 tháng 03 đến ngày 12 tháng 03 năm 2017)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '11', loaiBan: 'Bản gốc' },
      { p: '008.jpg', so: '07/TB-UBND', d: '13/03/2017', ty: 'Thông báo lịch làm việc tuần của Đảng ủy - HĐND - UBND xã (Từ ngày 13 tháng 03 đến ngày 19 tháng 03 năm 2017)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '12', loaiBan: 'Bản gốc' },
      { p: '009.jpg', so: '08/TB-UBND', d: '20/03/2017', ty: 'Thông báo lịch làm việc tuần của Đảng ủy - HĐND - UBND xã (Từ ngày 20 tháng 03 đến ngày 26 tháng 03 năm 2017)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '13', loaiBan: 'Bản gốc' },
      { p: '010.jpg', so: '09/TB-UBND', d: '10/04/2017', ty: 'Thông báo lịch làm việc tuần của Đảng ủy - HĐND - UBND xã (Từ ngày 10 tháng 04 đến ngày 16 tháng 04 năm 2017)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '14', loaiBan: 'Bản gốc' },
      { p: '011.jpg', so: '10/TB-UBND', d: '08/05/2017', ty: 'Thông báo lịch làm việc tuần của Đảng ủy - HĐND - UBND xã (Từ ngày 08 tháng 5 đến ngày 13 tháng 5 năm 2017)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '15', loaiBan: 'Bản gốc' },
      { p: '012.jpg', so: '11/TB-UBND', d: '15/05/2017', ty: 'Thông báo Lịch làm việc tuần của Đảng ủy - HĐND - UBND xã (Từ ngày 15 tháng 5 đến ngày 20 tháng 5 năm 2017)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '16', loaiBan: 'Bản gốc' },
      { p: '013.jpg', so: '27/TB-UBND', d: '22/05/2017', ty: 'Thông báo lịch làm việc tuần của Đảng ủy - HĐND - UBND xã (Từ ngày 22 tháng 5 đến ngày 27 tháng 5 năm 2017)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '17', loaiBan: 'Bản gốc' },
      { p: '014.jpg', so: '13/TB-UBND', d: '05/06/2017', ty: 'Thông báo lịch làm việc tuần của Đảng ủy - HĐND - UBND xã (Từ ngày 05 tháng 6 đến ngày 10 tháng 6 năm 2017)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '18', loaiBan: 'Bản gốc' }
    ]
  });

  // 6. PL_2017_17L
  await processDossier({
    dosId: 'PL_2017_17L',
    title: 'Hồ sơ Biên bản năm 2017 xã Phú Lộc (12/04/2017 đến 22/10/2017)',
    year: '2017',
    skipFiles: ['001.jpg', '016.jpg'],
    rowsConfig: [
      { p: '002.jpg', so: '', d: '12/04/2017', ty: 'Biên bản bàn giao', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '01', loaiBan: 'Bản gốc' },
      { p: '003.jpg', so: '', d: '06/07/2017', ty: 'Biên bản giao nhận chứng thư số', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '02', loaiBan: 'Bản gốc' },
      { p: '004.jpg', so: '', d: '24/08/2017', ty: 'Biên bản bàn giao sổ tay tiết kiệm điện', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '03', loaiBan: 'Bản gốc' },
      { p: '005.jpg', so: '', d: '14/09/2017', ty: 'Biên bản kiểm tra về việc thống kê các điểm đấu nối vào đường tỉnh, tả lai và công tác giải tỏa hành lang', tg: 'Thanh tra Sở GTVT tỉnh Đồng Nai', toSo: '04', loaiBan: 'Bản sao' },
      { p: '006.jpg', so: '', d: '19/10/2017', ty: 'Biên bản làm việc về việc kiểm tra điểm đấu nối tại Km 2+800 đường tỉnh 761, xã Phú Lộc, huyện Tân Phú, Đồng Nai', tg: 'Thanh tra Sở GTVT tỉnh Đồng Nai', toSo: '05', loaiBan: 'Bản sao' },
      { p: '007.jpg', so: '', d: '22/10/2017', ty: 'Biên bản kiểm phiếu và xác nhận kết quả bầu cử Trưởng ấp, khu phố nhiệm kỳ 2017-2020 (Ấp 1)', tg: 'Ủy ban nhân dân xã Phú Lộc - Tổ bầu cử Ấp 1', toSo: '06 - 07', loaiBan: 'Bản gốc' },
      { p: '008.jpg', so: '', d: '22/10/2017', ty: 'Biên bản kiểm phiếu và xác nhận kết quả bầu cử Trưởng ấp, khu phố nhiệm kỳ 2017-2020 (Ấp 2)', tg: 'Ủy ban nhân dân xã Phú Lộc - Tổ bầu cử Ấp 2', toSo: '08 - 09', loaiBan: 'Bản gốc' },
      { p: '009.jpg', so: '', d: '22/10/2017', ty: 'Biên bản kiểm phiếu và xác nhận kết quả bầu cử Trưởng ấp, khu phố nhiệm kỳ 2017-2020 (Ấp 3)', tg: 'Ủy ban nhân dân xã Phú Lộc - Tổ bầu cử Ấp 3', toSo: '10 - 11', loaiBan: 'Bản gốc' },
      { p: '010.jpg', so: '', d: '22/10/2017', ty: 'Biên bản kiểm phiếu và xác nhận kết quả bầu cử Trưởng ấp, khu phố nhiệm kỳ 2017-2020 (Ấp 4)', tg: 'Ủy ban nhân dân xã Phú Lộc - Tổ bầu cử Ấp 4', toSo: '12 - 13', loaiBan: 'Bản gốc' },
      { p: '011.jpg', so: '', d: '22/10/2017', ty: 'Biên bản kiểm phiếu và xác nhận kết quả bầu cử Trưởng ấp, khu phố nhiệm kỳ 2017-2020 (Ấp 5)', tg: 'Ủy ban nhân dân xã Phú Lộc - Tổ bầu cử Ấp 5', toSo: '14 - 15', loaiBan: 'Bản gốc' },
      { p: '012.jpg', so: '', d: '22/10/2017', ty: 'Biên bản kiểm phiếu và xác nhận kết quả bầu cử Trưởng ấp, khu phố nhiệm kỳ 2017-2020 (Ấp 6)', tg: 'Ủy ban nhân dân xã Phú Lộc - Tổ bầu cử Ấp 6', toSo: '16 - 17', loaiBan: 'Bản gốc' },
      { p: '013.jpg', so: '', d: '22/10/2017', ty: 'Biên bản kiểm phiếu và xác nhận kết quả bầu cử Trưởng ấp, khu phố nhiệm kỳ 2017-2020 (Ấp 7)', tg: 'Ủy ban nhân dân xã Phú Lộc - Tổ bầu cử Ấp 7', toSo: '18 - 19', loaiBan: 'Bản gốc' },
      { p: '014.jpg', so: '', d: '', ty: 'Biên bản về việc khảo sát thực tế nhu cầu sửa chữa trụ sở UBND xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '20', loaiBan: 'Bản sao' },
      { p: '015.jpg', files: ['015.jpg', '016.jpg'], so: '', d: '', ty: 'Biên bản nghiệm thu kiểm thử, vận hành thử tại UBND xã Phú Lộc, huyện Tân Phú, tỉnh Đồng Nai. Dự án: Triển khai phần mềm HCM E-Government Framework 2.0 - Phân hệ Một cửa điện tử tại 16 sở, ban, ngành và 134 UBND các xã, phường trên địa bàn tỉnh Đồng Nai', tg: 'Sở Thông tin và Truyền thông tỉnh Đồng Nai', toSo: '21 - 22', loaiBan: 'Bản gốc' }
    ]
  });

  // 7. PL_2017_17M
  await processDossier({
    dosId: 'PL_2017_17M',
    title: 'Hồ sơ Quyết định khen thưởng năm 2017 xã Phú Lộc (23/01/2017 đến 26/12/2017)',
    year: '2017',
    skipFiles: ['001.jpg', '014.jpg'],
    rowsConfig: [
      { p: '002.jpg', so: '01/QĐ-UBND', d: '23/01/2017', ty: 'Quyết định về việc tặng giấy khen cho tập thể có thành tích đột xuất trong công tác đấu tranh phòng chống tội phạm', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '01 - 03', loaiBan: 'Bản gốc' },
      { p: '003.jpg', so: '02/QĐ-UBND', d: '01/03/2017', ty: 'Quyết định về việc tặng giấy khen cho tập thể và cá nhân có thành tích xuất sắc trong công tác Đoàn và phong trào thanh thiếu nhi xã Phú Lộc nhiệm kỳ 2012 - 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '04 - 07', loaiBan: 'Bản gốc' },
      { p: '004.jpg', so: '03/QĐ-UBND', d: '13/03/2017', ty: 'Quyết định về việc tặng giấy khen cho tập thể và cá nhân có thành tích xuất sắc trong phong trào thi đua Hội cựu chiến binh nhiệm kỳ 2012 - 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '08 - 11', loaiBan: 'Bản gốc' },
      { p: '005.jpg', so: '04/QĐ-UBND', d: '22/03/2017', ty: 'Quyết định về việc Tặng giấy khen cho tập thể và cá nhân có thành tích xuất sắc trong công tác tuyển gọi công dân nhập ngũ năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '12 - 13', loaiBan: 'Bản gốc' },
      { p: '006.jpg', so: '05/QĐ-UBND', d: '28/03/2017', ty: 'Quyết định về việc tặng giấy khen cho các cá nhân có thành tích xuất sắc trong công tác 5 năm thực hiện phong trào thi đua "xây dựng nông thôn mới" (2012-2016)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '14', loaiBan: 'Bản gốc' },
      { p: '007.jpg', so: '06/QĐ-UBND', d: '12/06/2017', ty: 'Quyết định về việc tặng giấy khen cho các tập thể và cá nhân có thành tích xuất sắc trong phong trào thi đua học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh giai đoạn 01 năm (2016-2017)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '15 - 17', loaiBan: 'Bản gốc' },
      { p: '008.jpg', so: '07/QĐ-UBND', d: '29/06/2017', ty: 'Quyết định về việc tặng giấy khen cho tập thể và cá nhân có thành tích xuất sắc trong công tác huấn luyện dân quân năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '18 - 21', loaiBan: 'Bản gốc' },
      { p: '009.jpg', so: '08/QĐ-UBND', d: '02/08/2017', ty: 'Quyết định về việc tặng giấy khen cho các cá nhân có thành tích xuất sắc trong phong trào "TDBVANTQ" năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '22 - 25', loaiBan: 'Bản gốc' },
      { p: '010.jpg', so: '09/QĐ-UBND', d: '30/08/2017', ty: 'Quyết định về việc Tặng giấy khen cho các tập thể và cá nhân có thành tích xuất sắc trong công tác hè năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '26 - 35', loaiBan: 'Bản gốc' },
      { p: '011.jpg', so: '10/QĐ-UBND', d: '25/10/2017', ty: 'Quyết định về việc tặng giấy khen cho các cá nhân có thành tích xuất sắc trong các hoạt động Công đoàn nhiệm kỳ 2012 - 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '36 - 38', loaiBan: 'Bản gốc' },
      { p: '012.jpg', so: '11/QĐ-UBND', d: '15/11/2017', ty: 'Quyết định về việc tặng giấy khen cho các tập thể và cá nhân có thành tích xuất sắc trong công tác bầu cử Trưởng ấp, Phó trưởng ấp lần thứ VIII (nhiệm kỳ 2017 - 2020)', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '39 - 40', loaiBan: 'Bản gốc' },
      { p: '013.jpg', files: ['013.jpg', '014.jpg'], so: '12/QĐ-UBND', d: '26/12/2017', ty: 'Quyết định về việc tặng danh hiệu LĐTT cho các cá nhân có thành tích xuất sắc trong phong trào thi đua yêu nước năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc', toSo: '41 - 49', loaiBan: 'Bản gốc' }
    ]
  });

  console.log('Batch 2017-1 processing complete!');
}

run().catch(err => {
  console.error('Error in batch 2017-1:', err);
  process.exit(1);
});
