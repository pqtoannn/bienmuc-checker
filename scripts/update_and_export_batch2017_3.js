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
      if (skipFiles && skipFiles.includes(im.fileName)) {
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
  // 1. PL_2017_17S (60 rows, sheets 01 to 234)
  const starts17S = [
    { p: '001.jpg', s: 1 }, { p: '002.jpg', s: 14 }, { p: '003.jpg', s: 16 }, { p: '004.jpg', s: 19 }, { p: '005.jpg', s: 25 },
    { p: '006.jpg', s: 30, loaiBan: 'Photo' }, { p: '007.jpg', s: 40 }, { p: '008.jpg', s: 56, loaiBan: 'Photo' }, { p: '009.jpg', s: 68 }, { p: '010.jpg', s: 69 },
    { p: '011.jpg', s: 70 }, { p: '012.jpg', s: 71, loaiBan: 'Photo' }, { p: '013.jpg', s: 75 }, { p: '014.jpg', s: 76, loaiBan: 'Photo' }, { p: '015.jpg', s: 77 },
    { p: '016.jpg', s: 78 }, { p: '017.jpg', s: 81 }, { p: '018.jpg', s: 88 }, { p: '019.jpg', s: 91 }, { p: '020.jpg', s: 94 },
    { p: '021.jpg', s: 98 }, { p: '022.jpg', s: 101 }, { p: '023.jpg', s: 105 }, { p: '024.jpg', s: 107 }, { p: '025.jpg', s: 109 },
    { p: '026.jpg', s: 111 }, { p: '027.jpg', s: 114 }, { p: '028.jpg', s: 116 }, { p: '029.jpg', s: 117 }, { p: '030.jpg', s: 118 },
    { p: '031.jpg', s: 121 }, { p: '032.jpg', s: 124 }, { p: '033.jpg', s: 129 }, { p: '034.jpg', s: 130 }, { p: '035.jpg', s: 131 },
    { p: '036.jpg', s: 132 }, { p: '037.jpg', s: 133 }, { p: '038.jpg', s: 135 }, { p: '039.jpg', s: 136 }, { p: '040.jpg', s: 137, loaiBan: 'Photo' },
    { p: '041.jpg', s: 138, loaiBan: 'Photo' }, { p: '042.jpg', s: 139 }, { p: '043.jpg', s: 140 }, { p: '044.jpg', s: 141 }, { p: '045.jpg', s: 142 },
    { p: '046.jpg', s: 143 }, { p: '047.jpg', s: 144 }, { p: '048.jpg', s: 179, loaiBan: 'Photo' }, { p: '049.jpg', s: 187 }, { p: '050.jpg', s: 189 },
    { p: '051.jpg', s: 190 }, { p: '052.jpg', s: 191, loaiBan: 'Photo' }, { p: '053.jpg', s: 193, loaiBan: 'Photo' }, { p: '054.jpg', s: 197, loaiBan: 'Photo' }, { p: '055.jpg', s: 199, loaiBan: 'Photo' },
    { p: '056.jpg', s: 205, loaiBan: 'Photo' }, { p: '057.jpg', s: 206 }, { p: '058.jpg', s: 209 }, { p: '059.jpg', s: 222, loaiBan: 'Photo' }, { p: '060.jpg', s: 234, loaiBan: 'Photo' }
  ];

  const raw17S = [
    { so: '105/UBND', d: '22/11/2017', ty: 'Công văn về việc xin ý kiến nhận xét, đánh giá Nơi cư trú đối với CBCC xã Phú Lộc', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '25/11/2017', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức, viên chức năm 2017, bà Trần Thị Cẩm Nhung', tg: 'Bà Trần Thị Cẩm Nhung' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ năm 2017, bà Trương Thị Kiều Thúy', tg: 'Bà Trương Thị Kiều Thúy' },
    { so: '', d: '25/11/2017', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức, viên chức năm 2017, ông Nguyễn Ngọc Tú', tg: 'Ông Nguyễn Ngọc Tú' },
    { so: '', d: '', ty: 'Bản tự nhận xét đánh giá cán bộ, công chức, viên chức năm 2017, ông Bùi Văn Bình', tg: 'Ông Bùi Văn Bình' },
    { so: '', d: '28/11/2017', ty: 'Phiếu nhận xét, đánh giá của cấp ủy nơi cư trú đối với cán bộ, công chức năm 2017', tg: 'Đảng ủy thị trấn Tân Phú' },
    { so: '', d: '29/11/2017', ty: 'Phiếu đánh giá và phân loại công chức năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '07-HD/BTCHU', d: '29/11/2017', ty: 'Hướng dẫn kiểm điểm, tự phê bình và phê bình năm 2017', tg: 'Ban Tổ chức Huyện ủy Tân Phú' },
    { so: '', d: '05/12/2017', ty: 'Biên bản kiểm phiếu đánh giá cán bộ Ban chỉ huy Quân sự xã năm 2017', tg: 'Ban CHQS xã Phú Lộc' },
    { so: '', d: '05/12/2017', ty: 'Biên bản kiểm phiếu bình xét đề nghị khen thưởng năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '05/12/2017', ty: 'Trích biên bản họp đơn vị bình xét khen thưởng năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '', ty: 'Trích biên bản họp đơn vị nhận xét đánh giá cán bộ năm 2017 (Ban CHQS)', tg: 'Ban CHQS xã Phú Lộc' },
    { so: '', d: '05/12/2017', ty: 'Trích biên bản họp đơn vị nhận xét đánh giá cán bộ năm 2017 (Công an xã)', tg: 'Công an xã Phú Lộc' },
    { so: '', d: '05/12/2017', ty: 'Trích biên bản họp đơn vị đánh giá nhận xét cán bộ, công chức năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '', ty: 'Thống kê kết quả đánh giá cán bộ chuyên trách, công chức năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức, viên chức năm 2017, ông Nguyễn Tấn Hiệp', tg: 'Ông Nguyễn Tấn Hiệp' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức, viên chức năm 2017, bà Nguyễn Thị Ngọc Huệ', tg: 'Bà Nguyễn Thị Ngọc Huệ' },
    { so: '', d: '', ty: 'Bảng tự nhận xét, đánh giá cán bộ, công chức, viên chức năm 2017, ông Lưu Văn Hùng', tg: 'Ông Lưu Văn Hùng' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức, viên chức năm 2017, ông Huỳnh Văn Thiện', tg: 'Ông Huỳnh Văn Thiện' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức, viên chức năm 2017, bà Nguyễn Thị Kim Chi', tg: 'Bà Nguyễn Thị Kim Chi' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức, viên chức năm 2017, ông Nguyễn Lâm', tg: 'Ông Nguyễn Lâm' },
    { so: '', d: '', ty: 'Bảng tự nhận xét, đánh giá cán bộ, công chức, viên chức năm 2017, ông Trần Xuân Tuấn', tg: 'Ông Trần Xuân Tuấn' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ công chức năm 2017, bà Huỳnh Thị Ngọc Bích', tg: 'Bà Huỳnh Thị Ngọc Bích' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức năm 2017, bà Bùi Thị Hải', tg: 'Bà Bùi Thị Hải' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ bán chuyên trách năm 2017, bà Dương Thị Hạnh', tg: 'Bà Dương Thị Hạnh' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức năm 2017, ông Liễu Hoàng Toàn', tg: 'Ông Liễu Hoàng Toàn' },
    { so: '', d: '11/12/2017', ty: 'Trích biên bản họp Hội nghị đánh giá cán bộ năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '', ty: 'Bản tự nhận xét đánh giá phân loại cán bộ năm 2017, bà Trần Thị Ngọc Oanh', tg: 'Bà Trần Thị Ngọc Oanh' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức năm 2017, bà Nguyễn Thị Như', tg: 'Bà Nguyễn Thị Như' },
    { so: '', d: '29/11/2017', ty: 'Bảng tự nhận xét, đánh giá cán bộ, công chức năm 2017, ông Nguyễn Ngọc Thụ', tg: 'Ông Nguyễn Ngọc Thụ' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức năm 2017, ông Phạm Kim Sơn', tg: 'Ông Phạm Kim Sơn' },
    { so: '', d: '27/11/2017', ty: 'Bảng tự nhận xét, đánh giá cán bộ, công chức năm 2017, ông Trần Quốc Toản', tg: 'Ông Trần Quốc Toản' },
    { so: '', d: '24/11/2017', ty: 'Bảng tự nhận xét, đánh giá cán bộ, công chức năm 2017, ông Lê Hoàng Minh Tuấn', tg: 'Ông Lê Hoàng Minh Tuấn' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức năm 2017, bà Trần Thị Huệ', tg: 'Bà Trần Thị Huệ' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức năm 2017, bà Lê Thị Thu Hà', tg: 'Bà Lê Thị Thu Hà' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức năm 2017, bà Vũ Thị Nga', tg: 'Bà Vũ Thị Nga' },
    { so: '', d: '', ty: 'Bản tự nhận xét, đánh giá cán bộ, công chức năm 2017, bà Mai Thị Thêu', tg: 'Bà Mai Thị Thêu' },
    { so: '', d: '', ty: 'Nhận xét, đánh giá cán bộ (Của chi ủy nơi cư trú), bà Vũ Thị Nga', tg: 'Chi ủy Chi bộ ấp 4' },
    { so: '', d: '', ty: 'Nhận xét, đánh giá cán bộ (Của chi ủy nơi cư trú), bà Mai Thị Thêu', tg: 'Chi ủy Chi bộ ấp 4' },
    { so: '', d: '21/04/2017', ty: 'Phiếu nhận xét, đánh giá của cấp ủy nơi cư trú đối với cán bộ, đảng viên năm 2017', tg: 'Chi ủy Chi bộ' },
    { so: '', d: '16/11/2017', ty: 'Phiếu nhận xét, đánh giá của cấp ủy nơi cư trú đối với cán bộ, công chức năm 2017', tg: 'Chi ủy Chi bộ' },
    { so: '', d: '16/11/2017', ty: 'Phiếu nhận xét, đánh giá của cấp ủy nơi cư trú, bà Bùi Thị Hải', tg: 'Chi ủy Chi bộ' },
    { so: '', d: '19/11/2017', ty: 'Phiếu nhận xét, đánh giá của Cấp Ủy Nơi cư trú, ông Bùi Văn Bình', tg: 'Chi ủy Chi bộ' },
    { so: '', d: '', ty: 'Nhận xét, đánh giá cán bộ (Của chi ủy nơi cư trú), ông Nguyễn Tấn Hiệp', tg: 'Chi ủy Chi bộ' },
    { so: '', d: '', ty: 'Nhận xét, đánh giá cán bộ (Của chi ủy nơi cư trú), ông Nguyễn Lâm', tg: 'Chi ủy Chi bộ' },
    { so: '', d: '', ty: 'Nhận xét, đánh giá cán bộ (Của chi ủy nơi cư trú), bà Nguyễn Thị Ngọc Huệ', tg: 'Chi ủy Chi bộ' },
    { so: '', d: '12/12/2017', ty: 'Trích biên bản họp Hội nghị đánh giá, nhận xét cán bộ, công chức xã Phú Lộc năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '', ty: 'Phiếu đánh giá và phân loại công chức xã Phú Lộc năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '13/12/2017', ty: 'Trích biên bản họp Hội nghị đánh giá cán bộ, công chức năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '', ty: 'Thống kê kết quả đánh giá cán bộ, công chức năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '80/TB-UBND', d: '14/12/2017', ty: 'Thông báo kết quả họp xét đánh giá, phân loại cán bộ, công chức xã Phú Lộc năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '01/QĐ-UBND', d: '14/12/2017', ty: 'Quyết định về việc công nhận kết quả đánh giá, phân loại cán bộ, công chức xã Phú Lộc năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '12/12/2017', ty: 'Thống kê kết quả đánh giá cán bộ, công chức năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '12/12/2017', ty: 'Trích biên bản họp bình xét, đánh giá cán bộ năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '12/12/2017', ty: 'Biên bản hội nghị nhận xét, đánh giá cán bộ năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '12/12/2017', ty: 'Trích biên bản họp bình xét, đánh giá cán bộ năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '15/BC-UBND', d: '15/12/2017', ty: 'Báo cáo kết quả họp xét đánh giá, phân loại cán bộ, công chức xã Phú Lộc năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '15/12/2017', ty: 'Bảng kiểm điểm cá nhân năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '', ty: 'Bản tự kiểm điểm cá nhân năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' },
    { so: '', d: '', ty: 'Phiếu bổ sung lý lịch năm 2017', tg: 'Ủy ban nhân dân xã Phú Lộc' }
  ];

  const rows17S = [];
  const syncPhotos17S = [];
  for (let i = 0; i < starts17S.length; i++) {
    const s = starts17S[i].s;
    const end = (i < starts17S.length - 1) ? (starts17S[i + 1].s - 1) : 234;
    const toSo = (s === end) ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')} - ${String(end).padStart(2, '0')}`;
    const loaiBan = starts17S[i].loaiBan || 'Bản gốc';
    rows17S.push({
      p: starts17S[i].p,
      so: raw17S[i].so,
      d: raw17S[i].d,
      ty: raw17S[i].ty,
      tg: raw17S[i].tg,
      toSo,
      loaiBan
    });
    if (loaiBan === 'Photo') {
      syncPhotos17S.push({ ty: raw17S[i].ty });
    }
  }

  await processDossier({
    dosId: 'PL_2017_17S',
    title: 'Hồ sơ đánh giá cán bộ, công chức của UBND xã Phú Lộc năm 2017 (22/11/2017 đến 15/12/2017)',
    year: '2017',
    skipFiles: [], // 001.jpg is active!
    syncPhotos: syncPhotos17S,
    rowsConfig: rows17S
  });

  // 2. PL_2017_17X (62 rows, sheets 01 to 219)
  const starts17X = [
    { p: '002.jpg', s: 1 }, { p: '003.jpg', s: 3 }, { p: '004.jpg', s: 7 }, { p: '005.jpg', s: 9 }, { p: '006.jpg', s: 11 },
    { p: '007.jpg', s: 13 }, { p: '008.jpg', s: 15 }, { p: '009.jpg', s: 17 }, { p: '010.jpg', s: 18 }, { p: '011.jpg', s: 19 },
    { p: '012.jpg', s: 21 }, { p: '013.jpg', s: 22 }, { p: '014.jpg', s: 23 }, { p: '015.jpg', s: 24 }, { p: '016.jpg', s: 29 },
    { p: '017.jpg', s: 30 }, { p: '018.jpg', s: 35 }, { p: '019.jpg', s: 46 }, { p: '020.jpg', s: 47 }, { p: '021.jpg', s: 48 },
    { p: '022.jpg', s: 49 }, { p: '023.jpg', s: 64 }, { p: '024.jpg', s: 65 }, { p: '025.jpg', s: 74 }, { p: '026.jpg', s: 85 },
    { p: '027.jpg', s: 87 }, { p: '028.jpg', s: 88 }, { p: '029.jpg', s: 91 }, { p: '030.jpg', s: 95 }, { p: '031.jpg', s: 96 },
    { p: '032.jpg', s: 97 }, { p: '033.jpg', s: 98 }, { p: '034.jpg', s: 101 }, { p: '035.jpg', s: 103 }, { p: '036.jpg', s: 106 },
    { p: '037.jpg', s: 121 }, { p: '038.jpg', s: 122 }, { p: '039.jpg', s: 141 }, { p: '040.jpg', s: 142 }, { p: '041.jpg', s: 143 },
    { p: '042.jpg', s: 144 }, { p: '043.jpg', s: 145 }, { p: '044.jpg', s: 148 }, { p: '045.jpg', s: 149 }, { p: '046.jpg', s: 150 },
    { p: '047.jpg', s: 151 }, { p: '048.jpg', s: 152 }, { p: '049.jpg', s: 154 }, { p: '050.jpg', s: 155 }, { p: '051.jpg', s: 156 },
    { p: '052.jpg', s: 157 }, { p: '053.jpg', s: 158 }, { p: '054.jpg', s: 159 }, { p: '055.jpg', s: 161 }, { p: '056.jpg', s: 162 },
    { p: '057.jpg', s: 163 }, { p: '058.jpg', s: 164 }, { p: '059.jpg', s: 177 }, { p: '060.jpg', s: 196 }, { p: '061.jpg', s: 201 },
    { p: '062.jpg', s: 210 }, { p: '063.jpg', s: 219 }
  ];

  const raw17X = [
    { ty: 'Danh sách tổ nhân dân ấp 2 xã Phú Lộc (Tổ 10)' },
    { ty: 'Danh sách tổ nhân dân ấp 2 xã Phú Lộc (Tổ 9)' },
    { ty: 'Danh sách tổ nhân dân ấp 2 xã Phú Lộc (Tổ 7)' },
    { ty: 'Danh sách tổ nhân dân ấp 2 xã Phú Lộc (Tổ 6)' },
    { ty: 'Danh sách tổ nhân dân ấp 2 xã Phú Lộc (Tổ 4)' },
    { ty: 'Danh sách tổ nhân dân ấp 2 xã Phú Lộc (Tổ 3)' },
    { ty: 'Danh sách tổ nhân dân ấp 2 xã Phú Lộc (Tổ 5)' },
    { ty: 'Danh sách tổ viên tổ nhân dân ấp 2' },
    { ty: 'Danh sách tổ nhân dân ấp 2 xã Phú Lộc (Tổ 1)' },
    { ty: 'Danh sách tổ nhân dân ấp 2 xã Phú Lộc (Tổ 2)' },
    { ty: 'Danh sách cấp kinh phí hoạt động tổ nhân dân (Đợt 1)' },
    { ty: 'Danh sách cấp kinh phí hoạt động tổ nhân dân (Đợt 2)' },
    { ty: 'Danh sách cấp kinh phí hoạt động tổ nhân dân (Đợt 3)' },
    { ty: 'Danh sách trích ngang tổ trưởng, tổ phó tổ nhân dân' },
    { ty: 'Danh sách cấp kinh phí hoạt động tổ nhân dân' },
    { ty: 'Danh sách tổ trưởng tổ nhân dân ấp 1' },
    { ty: 'Danh sách cấp kinh phí hoạt động tổ nhân dân' },
    { ty: 'Danh sách tổ trưởng tổ nhân dân nhận tiền hỗ trợ' },
    { ty: 'Danh sách tổ trưởng tổ nhân dân các ấp ký nhận phụ cấp' },
    { ty: 'Danh sách nhận tiền hoạt động các Tổ nhân dân' },
    { d: '11/05/2017', ty: 'Biên bản về việc họp thống nhất cấp kinh phí cho tổ nhân dân' },
    { ty: 'Danh sách tổ nhân dân tổ 1 ấp 1 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 1, ấp 2, xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 1, ấp 5, xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 5 ấp 4 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 4 ấp 4 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 3 ấp 4 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 2 ấp 4 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 1 ấp 4 xã Phú Lộc' },
    { ty: 'Danh sách hộ nhân dân tổ 10 ấp 4 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 9 ấp 4 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 8 ấp 4 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 7 ấp 4 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 6 ấp 4 xã Phú Lộc' },
    { ty: 'Danh sách hộ nhân dân tổ 4, ấp 4, xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 1 ấp 5 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 1 ấp 3 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 3, ấp 3, xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 4, ấp 3, xã Phú Lộc' },
    { ty: 'Danh sách hộ nhân dân tổ 5 ấp 3 xã Phú Lộc' },
    { ty: 'Danh sách hộ nhân dân tổ 6 ấp 3 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 7, ấp 3, xã Phú Lộc' },
    { ty: 'Danh sách hộ nhân dân tổ 8, ấp 3, xã Phú Lộc' },
    { ty: 'Danh sách hộ nhân dân tổ 9 ấp 3 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 10 ấp 3 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 18 ấp 3 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 11 ấp 3 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 12, ấp 3, xã Phú Lộc' },
    { ty: 'Danh sách hộ nhân dân tổ 13, ấp 3, xã Phú Lộc' },
    { ty: 'Danh sách hộ nhân dân tổ 14, ấp 3, xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 15 ấp 3 xã Phú Lộc' },
    { ty: 'Danh sách hộ nhân dân tổ 16, ấp 3, xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 17, ấp 3, xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 18 ấp 3 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 19 ấp 3 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 20 ấp 3 xã Phú Lộc' },
    { ty: 'Danh sách tổ nhân dân tổ 4, ấp 4, xã Phú Lộc' },
    { ty: 'Đơn xin tham gia làm tổ trưởng tổ nhân dân (Tập 1)' },
    { ty: 'Đơn xin tham gia làm tổ trưởng tổ nhân dân (Tập 2)' },
    { ty: 'Đơn xin tham gia làm tổ trưởng tổ nhân dân (Tập 3)' },
    { ty: 'Đơn xin tham gia làm tổ trưởng tổ nhân dân (Tập 4)' },
    { ty: 'Đơn xin tham gia làm tổ trưởng tổ nhân dân (Tập 5)' }
  ];

  const rows17X = [];
  for (let i = 0; i < starts17X.length; i++) {
    const s = starts17X[i].s;
    const end = (i < starts17X.length - 1) ? (starts17X[i + 1].s - 1) : 219;
    const toSo = (s === end) ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')} - ${String(end).padStart(2, '0')}`;
    rows17X.push({
      p: starts17X[i].p,
      so: '',
      d: raw17X[i].d || '',
      ty: raw17X[i].ty,
      tg: 'Ủy ban nhân dân xã Phú Lộc',
      toSo,
      loaiBan: 'Bản gốc'
    });
  }

  await processDossier({
    dosId: 'PL_2017_17X',
    title: 'Hồ sơ Tổ nhân dân năm 2017 xã Phú Lộc (11/05/2017 đến 28/12/2017)',
    year: '2017',
    skipFiles: ['001.jpg'],
    rowsConfig: rows17X
  });

  console.log('Batch 2017-3 processing complete!');
}

run().catch(err => {
  console.error('Error in batch 2017-3:', err);
  process.exit(1);
});
