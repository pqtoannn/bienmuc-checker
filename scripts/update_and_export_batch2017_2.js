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

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  const outExcelOcr = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  await exportJsonToExcel(job, outExcelOcr);

  const outExcelDaCheck = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  await exportJsonToExcel(job, outExcelDaCheck);

  console.log(`Saved & Exported ${dosId} (${activeRows.length} rows)`);

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
  // 1. PL_2017_17D (36 rows, sheets 01 to 49)
  const starts17D = [
    { p: '002.jpg', s: 1 }, { p: '003.jpg', s: 2 }, { p: '004.jpg', s: 3 }, { p: '005.jpg', s: 4 }, { p: '006.jpg', s: 5 },
    { p: '007.jpg', s: 6 }, { p: '008.jpg', s: 7 }, { p: '009.jpg', s: 8 }, { p: '010.jpg', s: 9 }, { p: '011.jpg', s: 11 },
    { p: '012.jpg', s: 12 }, { p: '013.jpg', s: 14 }, { p: '014.jpg', s: 15 }, { p: '015.jpg', s: 16 }, { p: '016.jpg', s: 17 },
    { p: '017.jpg', s: 18 }, { p: '018.jpg', s: 20 }, { p: '019.jpg', s: 22 }, { p: '020.jpg', s: 23 }, { p: '021.jpg', s: 24 },
    { p: '022.jpg', s: 27 }, { p: '023.jpg', s: 28 }, { p: '024.jpg', s: 29 }, { p: '025.jpg', s: 32 }, { p: '026.jpg', s: 34 },
    { p: '027.jpg', s: 36 }, { p: '028.jpg', s: 38 }, { p: '029.jpg', s: 39 }, { p: '030.jpg', s: 40 }, { p: '031.jpg', s: 41 },
    { p: '032.jpg', s: 42 }, { p: '033.jpg', s: 43 }, { p: '034.jpg', s: 44 }, { p: '035.jpg', s: 45 }, { p: '036.jpg', s: 46 },
    { p: '037.jpg', s: 49 }
  ];

  const raw17D = [
    { d: '10/01/2017', ty: 'Danh sách công chức tham gia sử dụng hệ thống phần mềm quản lý văn bản và điều hành công việc' },
    { d: '06/02/2017', ty: 'Danh sách tham gia lớp tập huấn nghiệp vụ công tác Mặt trận cơ sở năm 2017' },
    { d: '13/03/2017', ty: 'Danh sách tham gia lớp tập huấn kỹ năng hoạt động cho đại biểu HĐND cấp xã nhiệm kỳ 2016-2021' },
    { d: '14/03/2017', ty: 'Danh sách cán bộ tham dự học tập kinh nghiệm tại tỉnh Bà Rịa Vũng Tàu' },
    { d: '27/03/2017', ty: 'Danh sách cử cán bộ, công chức tập huấn, bồi dưỡng kiểm tra, giám sát văn bản quy phạm pháp luật năm 2017' },
    { d: '14/04/2017', ty: 'Danh sách cán bộ tham dự tập huấn phần mềm ứng dụng chữ ký số' },
    { d: '14/04/2017', ty: 'Danh sách cử cán bộ tham gia các lớp học theo đề án 1956 đợt 1 năm 2017' },
    { d: '25/04/2017', ty: 'Danh sách các hộ khó khăn về nhà ở trên địa bàn xã Phú Lộc' },
    { d: '26/05/2017', ty: 'Danh sách tham dự lớp tập huấn phần mềm một cửa điện tử theo mô hình HCM Egov Framework 2.0' },
    { d: '01/06/2017', ty: 'Danh sách tập huấn nghiệp vụ quản lý cho ban quản lý HTX nông nghiệp năm 2017' },
    { d: '22/06/2017', ty: 'Danh sách CBCC đi bồi dưỡng về quản lý xây dựng' },
    { d: '', ty: 'Danh sách học viên tham dự lớp tập huấn cập nhật kiến thức bảo vệ môi trường nông thôn năm 2017' },
    { d: '10/07/2017', ty: 'Danh sách tập huấn kỹ năng quản lý, sử dụng và cập nhật thông tin trên hệ thống hồ sơ điện tử' },
    { d: '10/07/2017', ty: 'Danh sách tập huấn nghiệp vụ cho cán bộ đầu mối thực hiện nhiệm vụ kiểm soát TTHC năm 2017' },
    { d: '21/07/2017', ty: 'Danh sách cán bộ tham dự hội nghị triển khai hội thi ứng dụng CNTT trong hoạt động cơ quan nhà nước' },
    { d: '25/07/2017', ty: 'Danh sách cán bộ tham gia tập huấn kỹ năng quản lý, sử dụng và cập nhật thông tin trên hệ thống phần mềm khiếu nại tố cáo' },
    { d: '27/07/2017', ty: 'Danh sách tập huấn nghiệp vụ tiếp công dân, xử lý đơn thư và giải quyết khiếu nại tố cáo' },
    { d: '27/07/2017', ty: 'Danh sách tham gia lớp tập huấn hiến máu tình nguyện năm 2017' },
    { d: '', ty: 'Danh sách tập huấn công tác văn thư, lưu trữ năm 2017' },
    { d: '', ty: 'Danh sách tham gia hội thi ứng dụng CNTT năm 2017' },
    { d: '17/08/2017', ty: 'Danh sách lãnh đạo UBND xã Phú Lộc tham dự triển khai xây dựng văn hóa ứng xử năm 2017' },
    { d: '23/08/2017', ty: 'Danh sách tập huấn khởi sự doanh nghiệp năm 2017' },
    { d: '25/09/2017', ty: 'Danh sách tập huấn nghiệp vụ thực hiện dịch vụ công trực tuyến mức độ 3 và bưu chính công ích' },
    { d: '06/10/2017', ty: 'Danh sách tập huấn Luật tố tụng hành chính và kỹ năng tuyên truyền pháp luật năm 2017' },
    { d: '10/10/2017', ty: 'Danh sách tham dự tập huấn nghiệp vụ chuyển đổi và xây dựng hệ thống quản lý chất lượng theo ISO 9001:2015' },
    { d: '10/10/2017', ty: 'Danh sách tham dự lớp tập huấn kỹ thuật chăn nuôi bò thịt năm 2017' },
    { d: '22/10/2017', ty: 'Biểu tổng hợp kết quả bầu cử trưởng ấp, khu phố nhiệm kỳ 2017-2020' },
    { d: '27/10/2017', ty: 'Danh sách cán bộ, công chức đăng ký tham gia lớp bồi dưỡng công chức cấp xã năm 2017' },
    { d: '27/10/2017', ty: 'Danh sách cán bộ, công chức tham gia tập huấn kiến thức văn hóa công sở và đạo đức công vụ năm 2017' },
    { d: '01/11/2017', ty: 'Danh sách trích ngang cán bộ, công chức xã Phú Lộc' },
    { d: '08/11/2017', ty: 'Danh sách công chức tham gia lớp bồi dưỡng cập nhật kiến thức bảo vệ môi trường nông thôn năm 2017' },
    { d: '10/11/2017', ty: 'Danh sách tham dự tập huấn công tác xây dựng xã đạt chuẩn tiếp cận pháp luật' },
    { d: '26/11/2017', ty: 'Danh sách cán bộ, công chức thực hiện kê khai tài sản thu nhập năm 2017' },
    { d: '07/12/2017', ty: 'Danh sách tham dự hội nghị giao chỉ tiêu kinh tế - xã hội và dự toán thu chi ngân sách năm 2018' },
    { d: '13/12/2017', ty: 'Danh sách tham dự hội nghị giao chỉ tiêu kinh tế - xã hội huyện Tân Phú năm 2018' },
    { d: '', ty: 'Danh sách người dân, tổ chức lấy ý kiến về sự hài lòng đối với sự phục vụ của cơ quan hành chính nhà nước năm 2017' }
  ];

  const rows17D = [];
  for (let i = 0; i < starts17D.length; i++) {
    const s = starts17D[i].s;
    const end = (i < starts17D.length - 1) ? (starts17D[i + 1].s - 1) : 49;
    const toSo = (s === end) ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')} - ${String(end).padStart(2, '0')}`;
    rows17D.push({
      p: starts17D[i].p,
      so: '',
      d: raw17D[i].d,
      ty: raw17D[i].ty,
      tg: 'Ủy ban nhân dân xã Phú Lộc',
      toSo,
      loaiBan: 'Bản gốc'
    });
  }

  await processDossier({
    dosId: 'PL_2017_17D',
    title: 'Hồ sơ Danh sách cán bộ, công chức tham gia tập huấn, bồi dưỡng năm 2017 xã Phú Lộc (10/01/2017 đến 13/12/2017)',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: rows17D
  });

  // 2. PL_2017_17T (26 rows, sheets 01 to 54)
  const starts17T = [
    { p: '002.jpg', s: 1 }, { p: '003.jpg', s: 4 }, { p: '004.jpg', s: 5 }, { p: '005.jpg', s: 6 }, { p: '006.jpg', s: 7 },
    { p: '007.jpg', s: 8 }, { p: '008.jpg', s: 9 }, { p: '009.jpg', s: 11 }, { p: '010.jpg', s: 12 }, { p: '011.jpg', s: 19 },
    { p: '012.jpg', s: 20 }, { p: '013.jpg', s: 21 }, { p: '014.jpg', s: 22 }, { p: '015.jpg', s: 23 }, { p: '016.jpg', s: 24 },
    { p: '017.jpg', s: 25 }, { p: '018.jpg', s: 27 }, { p: '019.jpg', s: 31, loaiBan: 'Photo' }, { p: '020.jpg', s: 37, loaiBan: 'Photo' },
    { p: '021.jpg', s: 40, loaiBan: 'Photo' }, { p: '022.jpg', s: 43, loaiBan: 'Photo' }, { p: '023.jpg', s: 45, loaiBan: 'Photo' },
    { p: '024.jpg', s: 48, loaiBan: 'Photo' }, { p: '025.jpg', s: 50, loaiBan: 'Photo' }, { p: '026.jpg', s: 53, loaiBan: 'Photo' },
    { p: '027.jpg', s: 54, loaiBan: 'Photo' }
  ];

  const raw17T = [
    { so: '23/QĐ-UBND', d: '27/04/2017', ty: 'Quyết định về việc củng cố Ban chỉ đạo Tổng điều tra kinh tế năm 2017 xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '01/TB-BCĐ', d: '', ty: 'Thông báo phân công nhiệm vụ các thành viên Ban chỉ đạo Tổng điều tra kinh tế năm 2017', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '25/05/2017', ty: 'Tổng điều tra kinh tế năm 2017 bảng kê danh sách các cơ sở SXKD cá thể', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê cơ sở SXKD cá thể có địa điểm cố định (Ấp 1)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê cơ sở SXKD cá thể có địa điểm cố định (Ấp 2)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê cơ sở SXKD cá thể có địa điểm cố định (Ấp 3)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê cơ sở SXKD cá thể có địa điểm cố định (Ấp 4)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê cơ sở SXKD cá thể có địa điểm cố định (Ấp 5)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê cơ sở SXKD cá thể có địa điểm cố định (Ấp 6)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê cơ sở SXKD cá thể có địa điểm cố định (Ấp 7)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê danh sách cơ sở SXKD cá thể không có địa điểm cố định (Ấp 1)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê danh sách cơ sở SXKD cá thể không có địa điểm cố định (Ấp 2)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê danh sách cơ sở SXKD cá thể không có địa điểm cố định (Ấp 3)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê danh sách cơ sở SXKD cá thể không có địa điểm cố định (Ấp 4)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê danh sách cơ sở SXKD cá thể không có địa điểm cố định (Ấp 5)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê danh sách cơ sở SXKD cá thể không có địa điểm cố định (Ấp 6)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Bảng kê danh sách cơ sở SXKD cá thể không có địa điểm cố định (Ấp 7)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: 'Phiếu 3Y/TĐTKT-YT', d: '', ty: 'Phiếu thu thập thông tin về cơ sở y tế', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: 'Phiếu 3G/TĐTKT-GD', d: '', ty: 'Phiếu thu thập thông tin về cơ sở giáo dục (Trường Tiểu học)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: 'Phiếu 3G/TĐTKT-GD', d: '', ty: 'Phiếu thu thập thông tin về cơ sở giáo dục (Trường THCS)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: 'Phiếu 3G/TĐTKT-GD', d: '', ty: 'Phiếu thu thập thông tin về cơ sở giáo dục (Trường Mầm non)', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: 'Phiếu 3G/TĐTKT-GD', d: '', ty: 'Phiếu thu thập thông tin về cơ sở giáo dục', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: 'Phiếu 3A/TĐTKT-NN', d: '', ty: 'Phiếu thu thập thông tin về cơ quan Đảng, tổ chức chính trị - xã hội', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: 'Phiếu 3G/TĐTKT-GD', d: '', ty: 'Phiếu thu thập thông tin về cơ sở giáo dục dân lập', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: 'Phiếu 3A/TĐTKT-NN', d: '', ty: 'Phiếu thu thập thông tin về cơ quan nhà nước', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' },
    { so: '', d: '', ty: 'Phiếu điều tra cơ sở ứng dụng công nghệ thông tin', tg: 'Ban Chỉ đạo Tổng điều tra kinh tế năm 2017' }
  ];

  const rows17T = [];
  const syncPhotos17T = [];
  for (let i = 0; i < starts17T.length; i++) {
    const s = starts17T[i].s;
    const end = (i < starts17T.length - 1) ? (starts17T[i + 1].s - 1) : 54;
    const toSo = (s === end) ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')} - ${String(end).padStart(2, '0')}`;
    const loaiBan = starts17T[i].loaiBan || 'Bản chính';
    rows17T.push({
      p: starts17T[i].p,
      so: raw17T[i].so,
      d: raw17T[i].d,
      ty: raw17T[i].ty,
      tg: raw17T[i].tg,
      toSo,
      loaiBan
    });
    if (loaiBan === 'Photo') {
      syncPhotos17T.push({ ty: raw17T[i].ty });
    }
  }

  await processDossier({
    dosId: 'PL_2017_17T',
    title: 'Hồ sơ Tổng điều tra kinh tế năm 2017 xã Phú Lộc (27/04/2017 đến 25/05/2017)',
    year: '2017',
    skipFiles: ['001.jpg'],
    syncPhotos: syncPhotos17T,
    rowsConfig: rows17T
  });

  // 3. PL_2017_17W (29 rows, sheets 01 to 227)
  const starts17W = [
    { p: '002.jpg', s: 1 }, { p: '003.jpg', s: 3 }, { p: '004.jpg', s: 9 }, { p: '005.jpg', s: 11 }, { p: '006.jpg', s: 17, loaiBan: 'Photo' },
    { p: '007.jpg', s: 23, loaiBan: 'Photo' }, { p: '008.jpg', s: 24, loaiBan: 'Photo' }, { p: '009.jpg', s: 36 }, { p: '010.jpg', s: 39, loaiBan: 'Photo' },
    { p: '011.jpg', s: 42, loaiBan: 'Photo' }, { p: '012.jpg', s: 43, loaiBan: 'Photo' }, { p: '013.jpg', s: 56, loaiBan: 'Photo' },
    { p: '014.jpg', s: 65 }, { p: '015.jpg', s: 77 }, { p: '016.jpg', s: 97 }, { p: '017.jpg', s: 111 }, { p: '018.jpg', s: 129 },
    { p: '019.jpg', s: 130 }, { p: '020.jpg', s: 131 }, { p: '021.jpg', s: 150 }, { p: '022.jpg', s: 157 }, { p: '023.jpg', s: 171 },
    { p: '024.jpg', s: 182 }, { p: '025.jpg', s: 202 }, { p: '026.jpg', s: 213 }, { p: '027.jpg', s: 220 }, { p: '028.jpg', s: 222 },
    { p: '029.jpg', s: 224 }, { p: '030.jpg', s: 227 }
  ];

  const raw17W = [
    { so: '05/HĐ.TĐKT', d: '18/01/2017', ty: 'Công văn về việc phân công nhiệm vụ các thành viên Hội đồng Thi đua - Khen thưởng xã Phú Lộc', tg: 'Hội đồng Thi đua - Khen thưởng xã Phú Lộc' },
    { so: '10/QĐ-UBND', d: '18/01/2017', ty: 'Quyết định ban hành Quy chế tổ chức và hoạt động của Hội đồng Thi đua - Khen thưởng xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '11/QĐ-UBND', d: '18/01/2017', ty: 'Quyết định về việc củng cố Hội đồng thi đua - khen thưởng xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '12/QĐ-UBND', d: '19/01/2017', ty: 'Quyết định ban hành Quy định chấm điểm và bình xét thi đua ấp văn hóa trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '67-BC/ĐU', d: '10/02/2017', ty: 'Báo cáo kiểm điểm của Ban Thường vụ Đảng ủy xã Phú Lộc năm 2016', tg: 'Đảng ủy xã Phú Lộc' },
    { so: '', d: '10/02/2017', ty: 'Bản tự kiểm điểm cá nhân năm 2016', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '10/02/2017', ty: 'Bản tự kiểm điểm cá nhân năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '68-BC/ĐU', d: '28/02/2017', ty: 'Báo cáo kết quả kiểm điểm tự phê bình và phê bình tập thể và cá nhân năm 2016', tg: 'Đảng ủy xã Phú Lộc' },
    { so: '', d: '05/03/2017', ty: 'Bản tự kiểm điểm cá nhân năm 2016, ông Liễu Hoàng Toàn', tg: 'Ông Liễu Hoàng Toàn' },
    { so: '45/NV', d: '18/05/2017', ty: 'Công văn về việc bầu Tổ trưởng, Tổ phó tổ nhân dân nhiệm kỳ 2017 - 2020', tg: 'Phòng Nội vụ huyện Tân Phú' },
    { so: '161/QĐ-UBND', d: '28/11/2017', ty: 'Quyết định về việc củng cố Tổ nhân dân ấp 4 xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '162/QĐ-UBND', d: '28/04/2017', ty: 'Quyết định về việc công nhận Tổ trưởng, Tổ phó tổ nhân dân ấp 4 nhiệm kỳ 2017 - 2020', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '04/12/2017', ty: 'Tờ trình về việc củng cố tổ nhân dân trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '04/12/2017', ty: 'Biên bản về việc họp củng cố tổ nhân dân ấp 1 xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '04/12/2017', ty: 'Biên bản về việc họp thành lập tổ nhân dân ấp 2 xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '01/TTr-BND', d: '13/12/2017', ty: 'Tờ trình về việc đề nghị Chủ tịch UBND xã ra quyết định công nhận tổ trưởng, tổ phó tổ nhân dân', tg: 'Ban nhân dân ấp 3 xã Phú Lộc' },
    { so: '', d: '09/02/2018', ty: 'Biên bản họp Tổ nhân dân số 6 Ấp 5 về việc bầu Tổ trưởng', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '15/12/2017', ty: 'Tờ trình về việc đề nghị UBND xã ra Quyết định công nhận tổ trưởng tổ nhân dân ấp 5', tg: 'Ban nhân dân ấp 5 xã Phú Lộc' },
    { so: '', d: '18/12/2017', ty: 'Biên bản về việc họp thành lập tổ nhân dân ấp 6 xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '177/QĐ-UBND', d: '26/12/2017', ty: 'Quyết định về việc ban hành quy chế về tổ chức và hoạt động của Tổ nhân dân trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '178/QĐ-UBND', d: '26/12/2017', ty: 'Quyết định về việc củng cố Tổ trưởng, tổ phó tổ nhân dân ấp 1 nhiệm kỳ 2017 - 2020', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '199/QĐ-UBND', d: '26/12/2017', ty: 'Quyết định về việc củng cố Tổ trưởng, tổ phó tổ nhân dân ấp 2 nhiệm kỳ 2017 - 2020', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '200/QĐ-UBND', d: '26/12/2017', ty: 'Quyết định về việc củng cố Tổ trưởng, tổ phó tổ nhân dân ấp 3 nhiệm kỳ 2017 - 2020', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '219/QĐ-UBND', d: '26/12/2017', ty: 'Quyết định về việc củng cố Tổ trưởng, tổ phó tổ nhân dân ấp 5 nhiệm kỳ 2017 - 2020', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '229/QĐ-UBND', d: '26/12/2017', ty: 'Quyết định về việc củng cố Tổ trưởng, tổ phó tổ nhân dân ấp 6 nhiệm kỳ 2017 - 2020', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '235/QĐ-UBND', d: '26/12/2017', ty: 'Quyết định về việc củng cố Tổ nhân dân ấp 7 nhiệm kỳ 2017 - 2020', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '236/QĐ-UBND', d: '26/12/2017', ty: 'Quyết định về việc thành lập Tổ nhân dân trên địa bàn xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '26/12/2017', ty: 'Tờ trình về việc thành lập tổ nhân dân ấp 7 xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '28/12/2017', ty: 'Phương hướng thực hiện nhiệm vụ KTXH-ANQP năm 2018 xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' }
  ];

  const rows17W = [];
  const syncPhotos17W = [];
  for (let i = 0; i < starts17W.length; i++) {
    const s = starts17W[i].s;
    const end = (i < starts17W.length - 1) ? (starts17W[i + 1].s - 1) : 227;
    const toSo = (s === end) ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')} - ${String(end).padStart(2, '0')}`;
    const loaiBan = starts17W[i].loaiBan || 'Bản gốc';
    rows17W.push({
      p: starts17W[i].p,
      so: raw17W[i].so,
      d: raw17W[i].d,
      ty: raw17W[i].ty,
      tg: raw17W[i].tg,
      toSo,
      loaiBan
    });
    if (loaiBan === 'Photo') {
      syncPhotos17W.push({ ty: raw17W[i].ty });
    }
  }

  await processDossier({
    dosId: 'PL_2017_17W',
    title: 'Hồ sơ Thi đua khen thưởng và Tổ nhân dân năm 2017 xã Phú Lộc (18/01/2017 đến 26/12/2017)',
    year: '2017',
    skipFiles: ['001.jpg'],
    syncPhotos: syncPhotos17W,
    rowsConfig: rows17W
  });

  console.log('Batch 2017-2 processing complete!');
}

run().catch(err => {
  console.error('Error in batch 2017-2:', err);
  process.exit(1);
});
