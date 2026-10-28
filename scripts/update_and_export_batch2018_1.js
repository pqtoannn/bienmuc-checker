import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function process18M() {
  const dosId = 'PL_2018_18M';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ Quy chế tổ chức và hoạt động của Bộ phận tiếp nhận và trả kết quả năm 2018 xã Phú Lộc';
  job.data.tieuDeNghiQuyet = 'Hồ sơ Quy chế tổ chức và hoạt động của Bộ phận tiếp nhận và trả kết quả năm 2018 xã Phú Lộc';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = '2018';
  job.data.tongSoToText = '';

  // Mark 001.jpg as skip (scrap paper note)
  if (job.images && job.images[0]) {
    job.images[0].status = 'skip';
    job.images[0].isExcluded = true;
    job.images[0].skipReason = 'Tờ giấy nháp ghi chú đầu hồ sơ';
  }

  // Active rows: single 8-page document (002.jpg + 003.jpg)
  job.data.rows = [
    {
      soTT: '1',
      soKyHieuVanBan: '122/QĐ-UBND',
      ngayThangVanBan: '28/12/2018',
      tenLoaiTrichYeu: 'Quyết định ban hành Quy chế tổ chức và hoạt động của Bộ phận tiếp nhận và trả kết quả thuộc UBND xã Phú Lộc',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '01-08',
      loaiBan: 'Bản chính',
      ghiChu: '',
      banGocChinh: 'Bản chính',
      banSao: '',
      tomTatNoiDung: '',
      doMat: '',
      sourceFileNames: ['002.jpg', '003.jpg']
    }
  ];

  // Duplicate copy (004.jpg) is marked Trùng
  job.data.rowsTrung = [
    {
      soTT: '1',
      soKyHieuVanBan: '122/QĐ-UBND',
      ngayThangVanBan: '28/12/2018',
      tenLoaiTrichYeu: 'Quyết định ban hành Quy chế tổ chức và hoạt động của Bộ phận tiếp nhận và trả kết quả thuộc UBND xã Phú Lộc',
      tacGiaVanBan: 'Ủy ban nhân dân xã Phú Lộc',
      toSoTrangSo: '01-08',
      loaiBan: 'Bản trùng',
      ghiChu: 'Trùng văn bản số 122/QĐ-UBND',
      sourceFileNames: ['004.jpg']
    }
  ];

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

  // Sync to Tl_loại_VP_Toàn_PL.xlsx sheet Trùng
  console.log('Syncing Trùng row in 18M to Tl_loại_VP_Toàn_PL.xlsx...');
  await appendTaiLieuLoai({
    type: 'trung',
    tenVanBan: 'Quyết định ban hành Quy chế tổ chức và hoạt động của Bộ phận tiếp nhận và trả kết quả thuộc UBND xã Phú Lộc',
    soHoSo: dosId,
    thbq: 'Vĩnh viễn',
    lyDoTrung: `Trùng hs ${dosId}`
  });
  console.log(`Synced Trùng doc for ${dosId}`);
}

async function process18L() {
  const dosId = 'PL_2018_18L';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ Quyết định khen thưởng năm 2018 xã Phú Lộc (21/03/2018 đến 25/12/2018)';
  job.data.tieuDeNghiQuyet = 'Hồ sơ Quyết định khen thưởng năm 2018 xã Phú Lộc (21/03/2018 đến 25/12/2018)';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = '2018';
  job.data.tongSoToText = '';

  // Mark 001.jpg as skip (cover)
  if (job.images && job.images[0]) {
    job.images[0].status = 'skip';
    job.images[0].isExcluded = true;
    job.images[0].skipReason = 'Bìa hồ sơ lưu trữ';
  }

  // Active rows (002.jpg to 012.jpg, where 013.jpg is merged into 012.jpg)
  const rowsRaw = [
    {
      source: '002.jpg',
      soKyHieu: '02/QĐ-UBND',
      ngayThang: '21/03/2018',
      trichYeu: 'Quyết định về việc tặng Giấy khen cho các tập thể và cá nhân có thành tích xuất sắc trong phong trào công tác Hội nông dân xã khóa V (Nhiệm kỳ 2012 - 2017)',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '01-15',
      loaiBan: 'Photo'
    },
    {
      source: '003.jpg',
      soKyHieu: '03/QĐ-UBND',
      ngayThang: '13/04/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho tập thể và cá nhân có thành tích xuất sắc trong công tác tuyển gọi công dân nhập ngũ năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '16-43',
      loaiBan: 'Photo'
    },
    {
      source: '004.jpg',
      soKyHieu: '04/QĐ-UBND',
      ngayThang: '24/05/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các cá nhân có thành tích xuất sắc trong công tác 10 năm thực hiện Nghị quyết 26-NQ/TW của Ban chấp hành Trung ương Đảng (khóa X) về nông nghiệp, nông dân, nông thôn',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '44-74',
      loaiBan: 'Bản chính'
    },
    {
      source: '005.jpg',
      soKyHieu: '05/QĐ-UBND',
      ngayThang: '13/06/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các tập thể và cá nhân có thành tích tiêu biểu trong học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh giai đoạn 02 năm (2016-2018)',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '75-119',
      loaiBan: 'Bản chính'
    },
    {
      source: '006.jpg',
      soKyHieu: '06/QĐ-UBND',
      ngayThang: '13/07/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các cá nhân có thành tích tiêu biểu trong học tập lớp huấn luyện dân quân cơ động năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '120-129',
      loaiBan: 'Bản chính'
    },
    {
      source: '007.jpg',
      soKyHieu: '07/QĐ-UBND',
      ngayThang: '20/07/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho 01 tập thể và 03 cá nhân có thành tích tiêu biểu trong tham gia học tập lớp huấn luyện dân quân tại chỗ năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '130-137',
      loaiBan: 'Photo'
    },
    {
      source: '008.jpg',
      soKyHieu: '08/QĐ-UBND',
      ngayThang: '06/08/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho 18 cá nhân có thành tích xuất sắc trong phong trào "TDBVANTQ" năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '138-165',
      loaiBan: 'Photo'
    },
    {
      source: '009.jpg',
      soKyHieu: '09/QĐ-UBND',
      ngayThang: '20/08/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các tập thể và cá nhân có thành tích xuất sắc trong hoạt động hè năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '166',
      loaiBan: 'Photo'
    },
    {
      source: '010.jpg',
      soKyHieu: '10/QĐ-UBND',
      ngayThang: '13/11/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các cá nhân có thành tích xuất sắc trong phong trào "TDĐKXDĐSVHỞKDC" năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '167-180',
      loaiBan: 'Photo'
    },
    {
      source: '011.jpg',
      soKyHieu: '11/QĐ-UBND',
      ngayThang: '06/12/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các tập thể và cá nhân có thành tích xuất sắc trong hệ thống Mặt trận Tổ quốc xã nhiệm kỳ 2014 - 2019',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '181-215',
      loaiBan: 'Photo'
    },
    {
      sources: ['012.jpg', '013.jpg'],
      soKyHieu: '',
      ngayThang: '25/12/2018',
      trichYeu: 'Báo cáo thành tích đề nghị Chủ tịch huyện tặng giấy khen cho tập thể Ủy ban nhân dân xã Phú Lộc',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '216-296',
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
    banGocChinh: (r.loaiBan === 'Photo' ? '' : r.loaiBan),
    banSao: (r.loaiBan === 'Photo' ? 'Photo' : ''),
    tomTatNoiDung: '',
    doMat: '',
    sourceFileNames: r.sources || [r.source]
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
  console.log('Syncing Photo rows in 18L to Tl_loại_VP_Toàn_PL.xlsx...');
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

async function process18J() {
  const dosId = 'PL_2018_18J';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ khen thưởng năm 2018 xã Phú Lộc (05/01/2018 đến 26/12/2018)';
  job.data.tieuDeNghiQuyet = 'Hồ sơ khen thưởng năm 2018 xã Phú Lộc (05/01/2018 đến 26/12/2018)';
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = '2018';
  job.data.tongSoToText = '';

  // Mark 001.jpg as skip (scrap paper note)
  if (job.images && job.images[0]) {
    job.images[0].status = 'skip';
    job.images[0].isExcluded = true;
    job.images[0].skipReason = 'Tờ giấy nháp ghi chú đầu hồ sơ';
  }

  const rowsRaw = [
    {
      source: '002.jpg',
      soKyHieu: '01/QĐ-UBND',
      ngayThang: '05/01/2018',
      trichYeu: 'Quyết định về việc tặng Giấy khen cho các tập thể và cá nhân có thành tích xuất sắc trong phong trào thi đua yêu nước năm 2017',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '01-03',
      loaiBan: 'Bản chính'
    },
    {
      source: '003.jpg',
      soKyHieu: '02/QĐ-UBND',
      ngayThang: '21/03/2018',
      trichYeu: 'Quyết định về việc tặng Giấy khen cho các tập thể và cá nhân có thành tích xuất sắc trong phong trào công tác Hội nông dân xã khóa V (Nhiệm kỳ 2012 - 2017)',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '04-05',
      loaiBan: 'Bản chính'
    },
    {
      source: '004.jpg',
      soKyHieu: '04/QĐ-UBND',
      ngayThang: '24/05/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các cá nhân có thành tích xuất sắc trong công tác 10 năm thực hiện Nghị quyết 26-NQ/TW của Ban chấp hành Trung ương Đảng (khóa X) về nông nghiệp, nông dân, nông thôn',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '06',
      loaiBan: 'Bản chính'
    },
    {
      source: '005.jpg',
      soKyHieu: '05/QĐ-UBND',
      ngayThang: '13/06/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các tập thể và cá nhân có thành tích tiêu biểu trong học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh giai đoạn 02 năm (2016-2018)',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '07',
      loaiBan: 'Bản chính'
    },
    {
      source: '006.jpg',
      soKyHieu: '06/QĐ-UBND',
      ngayThang: '13/07/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các cá nhân có thành tích tiêu biểu trong học tập lớp huấn luyện dân quân cơ động năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '08',
      loaiBan: 'Bản chính'
    },
    {
      source: '007.jpg',
      soKyHieu: '07/QĐ-UBND',
      ngayThang: '20/07/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho 01 tập thể và 03 cá nhân có thành tích tiêu biểu trong tham gia học tập lớp huấn luyện dân quân tại chỗ năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '09',
      loaiBan: 'Bản chính'
    },
    {
      source: '008.jpg',
      soKyHieu: '08/QĐ-UBND',
      ngayThang: '06/08/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho 18 cá nhân có thành tích xuất sắc trong phong trào "TDBVANTQ" năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '10',
      loaiBan: 'Bản chính'
    },
    {
      source: '009.jpg',
      soKyHieu: '09/QĐ-UBND',
      ngayThang: '20/08/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các tập thể và cá nhân có thành tích xuất sắc trong hoạt động hè năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '11',
      loaiBan: 'Bản chính'
    },
    {
      source: '010.jpg',
      soKyHieu: '10/QĐ-UBND',
      ngayThang: '13/11/2018',
      trichYeu: 'Quyết định về việc tặng giấy khen cho các cá nhân có thành tích xuất sắc trong phong trào "TDĐKXDĐSVHỞKDC" năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '12',
      loaiBan: 'Bản chính'
    },
    {
      source: '011.jpg',
      soKyHieu: '12/QĐ-UBND',
      ngayThang: '26/12/2018',
      trichYeu: 'Quyết định về việc công nhận danh hiệu thi đua năm 2018',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '13-14',
      loaiBan: 'Bản chính'
    },
    {
      source: '012.jpg',
      soKyHieu: '',
      ngayThang: '26/12/2018',
      trichYeu: 'Danh sách chức vụ, đơn vị công tác của Cán Bộ, công chức xã Phú Lộc',
      tacGia: 'Ủy ban nhân dân xã Phú Lộc',
      toSo: '15',
      loaiBan: 'Bản chính'
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
}

async function main() {
  await process18M();
  await process18L();
  await process18J();
  console.log('Batch 2018-1 completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
