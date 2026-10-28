import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function process18N() {
  const dosId = 'PL_2018_18N';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ khen thưởng (Tập 02) năm 2018 xã Phú Lộc';
  job.data.tieuDeNghiQuyet = 'Hồ sơ khen thưởng (Tập 02) năm 2018 xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = '2018';
  job.data.tongSoToText = '';

  const rowsRaw = [
    {
      source: '001.jpg',
      soKyHieu: '02-TT/BTG',
      ngayThang: '17/01/2018',
      trichYeu: 'Tờ trình về việc đề nghị khen thưởng gương người tốt, việc tốt năm 2018',
      tacGia: 'Ban Tuyên giáo Đảng ủy xã Phú Lộc',
      toSo: '01',
      loaiBan: 'Bản gốc'
    },
    {
      source: '002.jpg',
      soKyHieu: '',
      ngayThang: '13/08/2018',
      trichYeu: 'Báo cáo thành tích đề nghị tặng giấy khen của UBND xã Phú Lộc đạt thành tích xuất sắc trong hoạt động hè năm 2018',
      tacGia: 'Ban Chỉ đạo hè xã Phú Lộc',
      toSo: '02-03',
      loaiBan: 'Bản gốc không mộc'
    },
    {
      source: '003.jpg',
      soKyHieu: '',
      ngayThang: '06/10/2018',
      trichYeu: 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của UBND huyện gương "Người tốt việc tốt" năm 2018',
      tacGia: 'Trường THCS Nguyễn Chí Thanh',
      toSo: '04-05',
      loaiBan: 'Bản gốc'
    },
    {
      source: '004.jpg',
      soKyHieu: '',
      ngayThang: '',
      trichYeu: 'Báo cáo thành tích đề nghị Đảng bộ xã Phú Lộc khen thưởng “Gương người tốt, việc tốt năm 2018”, đ/c Trương Khánh Linh',
      tacGia: 'Ban CHQS Xã',
      toSo: '06-09',
      loaiBan: 'Photo'
    },
    {
      source: '005.jpg',
      soKyHieu: '80/KH-TĐKT',
      ngayThang: '10/12/2018',
      trichYeu: 'Kế hoạch phát động phong trào thi đua yêu nước năm 2019',
      tacGia: 'Hội đồng TĐKT xã Phú Lộc',
      toSo: '10-11',
      loaiBan: 'Bản chính'
    },
    {
      source: '006.jpg',
      soKyHieu: '98/UBND-TĐKT',
      ngayThang: '10/12/2018',
      trichYeu: 'Công văn về việc đăng ký thi đua năm 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '12-13',
      loaiBan: 'Bản chính'
    },
    {
      source: '007.jpg',
      soKyHieu: '86/TB-HĐ.TĐKT',
      ngayThang: '25/12/2018',
      trichYeu: 'Thông báo kết luận chỉ đạo của Chủ tịch UBND xã - Chủ tịch Hội đồng thi đua khen thưởng xã tại cuộc họp xét khen thưởng phong trào thi đua yêu nước năm 2018',
      tacGia: 'Hội đồng TĐKT xã Phú Lộc',
      toSo: '14-18',
      loaiBan: 'Bản chính'
    },
    {
      source: '008.jpg',
      soKyHieu: '12/QĐ-UBND',
      ngayThang: '26/12/2018',
      trichYeu: 'Quyết định về việc công nhận danh hiệu thi đua năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '19-22',
      loaiBan: 'Photo'
    },
    {
      source: '009.jpg',
      soKyHieu: '13/QĐ-UBND',
      ngayThang: '26/12/2018',
      trichYeu: 'Danh sách các cá nhân được công nhận danh hiệu "Lao động tiên tiến" năm 2018 (Kèm theo Quyết định số 13/QĐ-UBND ngày 26/12/2018 của UBND xã Phú Lộc)',
      tacGia: 'Hội đồng TĐKT xã Phú Lộc',
      toSo: '23-24',
      loaiBan: 'Photo'
    },
    {
      source: '010.jpg',
      soKyHieu: '12/QĐ-UBND',
      ngayThang: '26/12/2018',
      trichYeu: 'Danh sách các tập thể và cá nhân được tặng Giấy khen năm 2018 (Kèm theo Quyết định số 12/QĐ-UBND ngày 26/12/2018 của Chủ tịch UBND xã Phú Lộc)',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '25-27',
      loaiBan: 'Photo'
    },
    {
      source: '011.jpg',
      soKyHieu: '13/QĐ-UBND',
      ngayThang: '26/12/2018',
      trichYeu: 'Danh sách cá nhân được tặng giấy khen (Kèm theo Quyết định số 13/QĐ-UBND ngày 26/12/2018 của Chủ tịch UBND xã Phú Lộc)',
      tacGia: 'BCĐ PC AIDS, TP & TNXH',
      toSo: '28',
      loaiBan: 'Bản gốc'
    },
    {
      source: '012.jpg',
      soKyHieu: '165/BC-HĐ.TĐKT',
      ngayThang: '26/12/2018',
      trichYeu: 'Báo cáo Tổng kết phong trào thi đua yêu nước năm 2018 và Phương hướng nhiệm vụ công tác năm 2019',
      tacGia: 'Hội đồng TĐKT xã Phú Lộc',
      toSo: '29-34',
      loaiBan: 'Bản gốc không mộc'
    },
    {
      source: '013.jpg',
      soKyHieu: '',
      ngayThang: '2018',
      trichYeu: 'Báo cáo kết quả thực hiện Chương trình xây dựng nông thôn mới nâng cao năm 2018; Phương hướng, nhiệm vụ và giải pháp thực hiện năm 2019',
      tacGia: 'BCĐ NNND&XDNTM Xã Phú Lộc',
      toSo: '35-40',
      loaiBan: 'Bản gốc'
    },
    {
      source: '014.jpg',
      soKyHieu: '',
      ngayThang: '2018',
      trichYeu: 'Bảng tổng hợp kết quả thực hiện các tiêu chí nông thôn mới',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '41',
      loaiBan: 'Bản gốc'
    }
  ];

  job.data.rows = rowsRaw.map((r, idx) => ({
    soTT: String(idx + 1),
    soKyHieuVanBan: r.soKyHieu,
    ngayThangVanBan: r.ngayThang,
    tenLoaiTrichYeu: r.trichYeu,
    tacGiaVanBan: r.tacGia,
    toSoTrangSo: r.toSo,
    loaiBan: r.loaiBan,
    ghiChu: '',
    banGocChinh: r.loaiBan.includes('gốc') || r.loaiBan.includes('chính') ? r.loaiBan : '',
    banSao: r.loaiBan === 'Photo' ? 'Photo' : '',
    tomTatNoiDung: '',
    doMat: '',
    sourceFileNames: [r.source]
  }));

  job.data.rowsTrung = [];
  job.status = 'completed';
  job.updatedAt = new Date().toISOString();

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Updated job for ${dosId}`);

  const out1 = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  const out2 = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  await exportJsonToExcel(job, out1);
  await exportJsonToExcel(job, out2);
  console.log(`Exported ${dosId} to Da_check and PL_outputOCR`);

  // Sync Photo rows
  console.log(`Syncing Photo rows in ${dosId} to Tl_loại_VP_Toàn_PL.xlsx...`);
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

async function process18K() {
  const dosId = 'PL_2018_18K';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ Văn bản khác năm 2018 xã Phú Lộc (11/01/2018 đến 08/08/2018)';
  job.data.tieuDeNghiQuyet = 'Hồ sơ Văn bản khác năm 2018 xã Phú Lộc (11/01/2018 đến 08/08/2018)';
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

  const rowsRaw = [
    {
      source: '002.jpg',
      soKyHieu: '',
      ngayThang: '11/01/2018',
      trichYeu: 'Danh sách cử lãnh đạo quản lý điểm thông tin khoa học công nghệ và giới thiệu cán bộ ký hợp đồng trực điểm thông tin khoa học công nghệ',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '01-21',
      loaiBan: 'Bản gốc'
    },
    {
      source: '003.jpg',
      soKyHieu: '',
      ngayThang: '',
      trichYeu: 'Danh sách cử cán bộ, công chức tham gia khóa đào tạo, bồi dưỡng công tác tiếp dân, xử lý đơn thư',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '22',
      loaiBan: 'Bản gốc'
    },
    {
      source: '004.jpg',
      soKyHieu: '',
      ngayThang: '31/01/2018',
      trichYeu: 'Số liệu về bản tin giấy, trang thông tin điện tử, bảng tin điện tử, tủ sách pháp luật của xã, phường, thị trấn và điểm bưu điện - văn hóa xã (Tính đến ngày 31/12/2017)',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '23-27',
      loaiBan: 'Bản gốc'
    },
    {
      source: '005.jpg',
      soKyHieu: '01/BPC-UBND',
      ngayThang: '22/02/2018',
      trichYeu: 'Bảng phân công thành viên UBND xã điều hành nhiệm vụ KTXH - ANQP trong năm 2018 và phân công nhiệm vụ công chức và không chuyên trách xã',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '28-35',
      loaiBan: 'Bản gốc'
    },
    {
      source: '006.jpg',
      soKyHieu: '',
      ngayThang: '01/03/2018',
      trichYeu: 'Biên bản bàn giao hồ sơ địa chính, bản đồ địa chính',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '36',
      loaiBan: 'Bản gốc'
    },
    {
      source: '007.jpg',
      soKyHieu: '',
      ngayThang: '01/03/2018',
      trichYeu: 'Các chỉ tiêu chủ yếu cần thực hiện trong năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '37-38',
      loaiBan: 'Bản gốc'
    },
    {
      source: '008.jpg',
      soKyHieu: '',
      ngayThang: '11/04/2018',
      trichYeu: 'Báo cáo tình hình sử dụng điện trên địa bàn tính đến 11/4/2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '39',
      loaiBan: 'Bản gốc'
    },
    {
      source: '009.jpg',
      soKyHieu: '38/QĐ-UBND',
      ngayThang: '03/05/2018',
      trichYeu: 'Quy chế làm việc của Ban chỉ đạo Giảm nghèo xã Phú Lộc (Ban hành theo quyết định số 38/QĐ-UBND ngày 03 tháng 05 năm 2018)',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '40-42',
      loaiBan: 'Bản gốc'
    },
    {
      source: '010.jpg',
      soKyHieu: '',
      ngayThang: '01/06/2018',
      trichYeu: 'Cán bộ phụ trách nhận cây hoàng yến xã Phú Lộc',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '43',
      loaiBan: 'Bản gốc'
    },
    {
      source: '011.jpg',
      soKyHieu: '',
      ngayThang: '18/06/2018',
      trichYeu: 'Đăng ký tham dự hội thi kể chuyện theo sách hè năm 2018',
      tacGia: 'Ban Chỉ Đạo Hè',
      toSo: '44',
      loaiBan: 'Bản gốc'
    },
    {
      source: '012.jpg',
      soKyHieu: '',
      ngayThang: '19/06/2018',
      trichYeu: 'Tổng hợp tình hình quản lý sử dụng đất, cấp giấy chứng nhận (kèm theo văn bản số 3581/STNMT-CCQLĐĐ ngày 06 tháng 6 năm 2018 của Sở Tài nguyên và Môi trường)',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '45',
      loaiBan: 'Bản gốc'
    },
    {
      source: '013.jpg',
      soKyHieu: '',
      ngayThang: '12/07/2018',
      trichYeu: 'Đơn xin nghỉ phép của ông Nguyễn Thế Mai',
      tacGia: 'Nguyễn Thế Mai',
      toSo: '46',
      loaiBan: 'Bản gốc'
    },
    {
      source: '014.jpg',
      soKyHieu: '',
      ngayThang: '08/08/2018',
      trichYeu: 'Đơn yêu cầu giải quyết tranh chấp đất đai của ông Nguyễn Thái Hiệp',
      tacGia: 'Nguyễn Thái Hiệp',
      toSo: '47-48',
      loaiBan: 'Bản gốc không mộc'
    },
    {
      source: '015.jpg',
      soKyHieu: '',
      ngayThang: '2018',
      trichYeu: 'Phụ lục giao chỉ tiêu thu nhân dân đóng góp XHHGT năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '49',
      loaiBan: 'Bản gốc'
    }
  ];

  job.data.rows = rowsRaw.map((r, idx) => ({
    soTT: String(idx + 1),
    soKyHieuVanBan: r.soKyHieu,
    ngayThangVanBan: r.ngayThang,
    tenLoaiTrichYeu: r.trichYeu,
    tacGiaVanBan: r.tacGia,
    toSoTrangSo: r.toSo,
    loaiBan: r.loaiBan,
    ghiChu: '',
    banGocChinh: r.loaiBan.includes('gốc') || r.loaiBan.includes('chính') ? r.loaiBan : '',
    banSao: '',
    tomTatNoiDung: '',
    doMat: '',
    sourceFileNames: [r.source]
  }));

  job.data.rowsTrung = [];
  job.status = 'completed';
  job.updatedAt = new Date().toISOString();

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Updated job for ${dosId}`);

  const out1 = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  const out2 = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  await exportJsonToExcel(job, out1);
  await exportJsonToExcel(job, out2);
  console.log(`Exported ${dosId} to Da_check and PL_outputOCR`);
}

async function process18I() {
  const dosId = 'PL_2018_18I';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ kiểm tra kỷ cương hành chính, đạo đức công vụ năm 2018 xã Phú Lộc (02/01/2018 đến 25/10/2018)';
  job.data.tieuDeNghiQuyet = 'Hồ sơ kiểm tra kỷ cương hành chính, đạo đức công vụ năm 2018 xã Phú Lộc (02/01/2018 đến 25/10/2018)';
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

  const rowsRaw = [
    {
      source: '002.jpg',
      soKyHieu: '01/KH-UBND',
      ngayThang: '02/01/2018',
      trichYeu: 'Kế hoạch thực hiện năm “Kỷ cương hành chính, đạo đức công vụ” trong thi hành nhiệm vụ của Cán bộ, công chức xã Phú Lộc',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '01-06',
      loaiBan: 'Bản gốc'
    },
    {
      source: '003.jpg',
      soKyHieu: '',
      ngayThang: '04/01/2018',
      trichYeu: 'Biên bản kiểm tra về việc kiểm tra công vụ',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '07-08',
      loaiBan: 'Bản gốc'
    },
    {
      source: '004.jpg',
      soKyHieu: '10/QĐ-UBND',
      ngayThang: '04/04/2017',
      trichYeu: 'Quyết định về việc củng cố tổ kiểm tra “Kỷ cương hành chính, đạo đức, công vụ” đối với cán bộ, công chức xã Phú Lộc',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '09-10',
      loaiBan: 'Bản gốc'
    },
    {
      source: '005.jpg',
      soKyHieu: '49/UBND',
      ngayThang: '13/04/2018',
      trichYeu: 'Công văn về việc chấn chỉnh việc chấp hành kỷ luật, kỷ cương hành chính, đạo đức công vụ đối với cán bộ, công chức tại xã Phú Lộc',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '11-12',
      loaiBan: 'Bản chính'
    },
    {
      source: '006.jpg',
      soKyHieu: '31/BC-UBND',
      ngayThang: '16/04/2018',
      trichYeu: 'Báo cáo về việc chấn chỉnh việc chấp hành kỷ luật, kỷ cương hành chính, đạo đức công vụ đối với cán bộ, công chức tại xã Phú Lộc',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '13-14',
      loaiBan: 'Bản chính'
    },
    {
      source: '007.jpg',
      soKyHieu: '',
      ngayThang: '07/05/2018',
      trichYeu: 'Biên bản kiểm tra về việc kiểm tra công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '15',
      loaiBan: 'Bản gốc'
    },
    {
      source: '008.jpg',
      soKyHieu: '',
      ngayThang: '11/05/2018',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '16-17',
      loaiBan: 'Bản gốc'
    },
    {
      source: '009.jpg',
      soKyHieu: '',
      ngayThang: '14/05/2018',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '18',
      loaiBan: 'Bản gốc'
    },
    {
      source: '010.jpg',
      soKyHieu: '',
      ngayThang: '22/05/2018',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '19',
      loaiBan: 'Bản gốc'
    },
    {
      source: '011.jpg',
      soKyHieu: '',
      ngayThang: '05/06/2018',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '20',
      loaiBan: 'Bản gốc'
    },
    {
      source: '012.jpg',
      soKyHieu: '',
      ngayThang: '18/06/2018',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '21',
      loaiBan: 'Bản gốc'
    },
    {
      source: '013.jpg',
      soKyHieu: '',
      ngayThang: '16/07/2018',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '22',
      loaiBan: 'Bản gốc'
    },
    {
      source: '014.jpg',
      soKyHieu: '',
      ngayThang: '16/07/2018',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '23',
      loaiBan: 'Bản gốc'
    },
    {
      source: '015.jpg',
      soKyHieu: '',
      ngayThang: '08/08/2018',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '24',
      loaiBan: 'Bản gốc'
    },
    {
      source: '016.jpg',
      soKyHieu: '',
      ngayThang: '08/08/2018',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '25',
      loaiBan: 'Bản gốc'
    },
    {
      source: '017.jpg',
      soKyHieu: '',
      ngayThang: '29/08/2018',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '26',
      loaiBan: 'Bản gốc'
    },
    {
      source: '018.jpg',
      soKyHieu: '',
      ngayThang: '04/09/2018',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '27',
      loaiBan: 'Bản gốc'
    },
    {
      source: '019.jpg',
      soKyHieu: '',
      ngayThang: '11/09/2018',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '28',
      loaiBan: 'Bản gốc'
    },
    {
      source: '020.jpg',
      soKyHieu: '',
      ngayThang: '25/10/2018',
      trichYeu: 'Biên bản kiểm tra công vụ về kỷ cương hành chính, đạo đức công vụ',
      tacGia: 'Tổ kiểm tra - UBND huyện Tân Phú',
      toSo: '29',
      loaiBan: 'Bản gốc'
    },
    {
      source: '021.jpg',
      soKyHieu: '',
      ngayThang: '',
      trichYeu: 'Biên bản kiểm tra về việc thực hiện nhiệm vụ công tác cải cách hành chính',
      tacGia: 'Tổ kiểm tra công vụ - Ủy ban nhân dân xã Phú Lộc',
      toSo: '30-41',
      loaiBan: 'Bản gốc không mộc'
    },
    {
      source: '022.jpg',
      soKyHieu: '',
      ngayThang: '26/04/2018',
      trichYeu: 'Biên bản kiểm tra công tác cải cách hành chính, đạo đức công vụ',
      tacGia: 'Tổ kiểm tra - UBND huyện Tân Phú',
      toSo: '42',
      loaiBan: 'Bản gốc'
    }
  ];

  job.data.rows = rowsRaw.map((r, idx) => ({
    soTT: String(idx + 1),
    soKyHieuVanBan: r.soKyHieu,
    ngayThangVanBan: r.ngayThang,
    tenLoaiTrichYeu: r.trichYeu,
    tacGiaVanBan: r.tacGia,
    toSoTrangSo: r.toSo,
    loaiBan: r.loaiBan,
    ghiChu: '',
    banGocChinh: r.loaiBan.includes('gốc') || r.loaiBan.includes('chính') ? r.loaiBan : '',
    banSao: '',
    tomTatNoiDung: '',
    doMat: '',
    sourceFileNames: [r.source]
  }));

  job.data.rowsTrung = [];
  job.status = 'completed';
  job.updatedAt = new Date().toISOString();

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Updated job for ${dosId}`);

  const out1 = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  const out2 = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  await exportJsonToExcel(job, out1);
  await exportJsonToExcel(job, out2);
  console.log(`Exported ${dosId} to Da_check and PL_outputOCR`);
}

async function main() {
  await process18N();
  await process18K();
  await process18I();
  console.log('Batch 2018-2 processed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
