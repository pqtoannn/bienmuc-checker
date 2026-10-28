import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

// ==========================================
// PROCESS PL_2020_20M
// ==========================================
async function process20M() {
  console.log('\n>>> PROCESSING PL_2020_20M...');
  const jobPath = path.join(OUTPUT_OCR_DIR, 'PL_2020_20M.job.json');
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  // 24 photos: 001 is cover note
  // Active documents: 002 to 024 (23 documents)
  const starts = {
    2: 1, 3: 2, 4: 12, 5: 13, 6: 26, 7: 55, 8: 78, 9: 80, 10: 90,
    11: 92, 12: 94, 13: 106, 14: 111, 15: 115, 16: 116, 17: 130, 18: 139,
    19: 146, 20: 150, 21: 165, 22: 170, 23: 182, 24: 194
  };

  const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
  const pad = n => String(n).padStart(2, '0');
  const ranges = {};

  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const cur = starts[p];
    if (p === 24) {
      ranges[p] = pad(cur);
    } else {
      const nextP = keys[i + 1];
      const next = starts[nextP];
      if (next - 1 === cur) {
        ranges[p] = pad(cur);
      } else {
        ranges[p] = `${pad(cur)}-${pad(next - 1)}`;
      }
    }
  }

  // Backup original
  if (!fs.existsSync(jobPath + '.bak')) {
    fs.copyFileSync(jobPath, jobPath + '.bak');
  }

  job.images = [];
  for (let i = 1; i <= 24; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const isSkip = (i === 1);
    job.images.push({
      fileName: fn,
      status: isSkip ? 'skip' : 'active',
      isExcluded: isSkip
    });
  }

  const activeRows = [];
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    const fn = String(p).padStart(3, '0') + '.jpg';
    const r = job.data.rows.find(row => row.sourceFileNames && row.sourceFileNames.includes(fn)) || job.data.rows[p - 1];

    let trichYeu = (r.tenLoaiTrichYeu || '').trim();
    trichYeu = trichYeu.replace(/^v\/v:?\s*/i, 'về việc ');
    let soKyHieu = (r.soKyHieuVanBan || '').trim().replace(/^Số:?\s*/i, '');
    let ngayThang = (r.ngayThangVanBan || '').trim();
    let tacGia = (r.tacGiaVanBan || 'UBND xã Phú Lộc').trim();

    // Specific corrections from visual inspection:
    if (p === 2) {
      soKyHieu = '02/TM-CTĐ';
      tacGia = 'UBND huyện Tân Phú - Cụm thi đua số 1';
      ngayThang = '20/07/2020';
      trichYeu = 'Thư mời tổ chức sơ kết phong trào thi đua 6 tháng đầu năm 2020';
    }
    if (p === 3) {
      soKyHieu = '342/BC-UBND';
      tacGia = 'Ủy ban nhân dân huyện Tân Phú';
      ngayThang = '23/09/2020';
      trichYeu = 'Báo cáo tổng kết công tác thi đua, khen thưởng (2015 - 2020) phương hướng nhiệm vụ giai đoạn 2020 - 2025';
    }
    if (p === 4) {
      soKyHieu = '184/QĐ-UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '26/10/2020';
      trichYeu = 'Quyết định về việc củng cố Hội đồng thi đua khen thưởng xã Phú Lộc';
    }
    if (p === 7) {
      soKyHieu = '117/UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '10/11/2020';
      trichYeu = 'Công văn về việc đăng ký sáng kiến kinh nghiệm đề nghị khen thưởng năm 2020';
    }
    if (p === 12) {
      soKyHieu = '07/TTr-CCB';
      tacGia = 'Hội CCB huyện Tân Phú - Hội CCB xã Phú Lộc';
      ngayThang = '06/12/2020';
    }
    if (p === 13) {
      soKyHieu = '16/TTr-HND';
      tacGia = 'Hội Nông dân huyện Tân Phú - BCH Hội Nông dân xã Phú Lộc';
      ngayThang = '10/12/2020';
    }
    if (p === 14) {
      soKyHieu = '34/TTr-BCH';
      tacGia = 'Ban Chỉ huy Quân sự xã Phú Lộc';
      ngayThang = '14/12/2020';
    }
    if (p === 15) {
      soKyHieu = '05/TTr-MTX';
      tacGia = 'Ủy ban MTTQ Việt Nam xã Phú Lộc - Ban Thường trực';
      ngayThang = '15/12/2020';
    }
    if (p === 16) {
      soKyHieu = '02/TTr-HPN';
      tacGia = 'Hội LHPN xã Phú Lộc - Ban Chấp hành';
      ngayThang = '16/12/2020';
    }
    if (p === 17) {
      soKyHieu = '11-TTr/ĐTN';
      tacGia = 'Huyện đoàn Tân Phú - BCH Đoàn xã Phú Lộc';
      ngayThang = '16/12/2020';
    }
    if (p === 18) {
      soKyHieu = '12/TTr-CAX';
      tacGia = 'Công an huyện Tân Phú - Công an xã Phú Lộc';
      ngayThang = '16/12/2020';
    }
    if (p === 19) {
      soKyHieu = '04-TTr/ĐU';
      tacGia = 'Đảng bộ huyện Tân Phú - Đảng ủy xã Phú Lộc';
      ngayThang = '21/12/2020';
    }
    if (p === 20) {
      soKyHieu = '106/TTr-UBND';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '29/12/2020';
    }
    if (p === 21) {
      soKyHieu = '';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '29/12/2020';
      trichYeu = 'Tóm tắt thành tích cá nhân điển hình tiên tiến trong phong trào thi đua yêu nước giai đoạn 2015-2020';
    }
    if (p === 22) {
      soKyHieu = '';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '29/12/2020';
      trichYeu = 'Phiếu bình xét đề nghị cấp huyện, tỉnh khen thưởng điển hình tiên tiến giai đoạn 2015 - 2020';
    }
    if (p === 23) {
      soKyHieu = '';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '29/12/2020';
      trichYeu = 'Phiếu bình xét đề nghị cấp xã khen thưởng điển hình tiên tiến giai đoạn 2015 - 2020';
    }
    if (p === 24) {
      soKyHieu = '';
      tacGia = 'UBND xã Phú Lộc';
      ngayThang = '29/12/2020';
      trichYeu = 'Báo cáo thành tích đề nghị tặng thưởng giấy khen của Chủ tịch UBND xã Phú Lộc, ông Phạm Văn Lực';
    }

    activeRows.push({
      soTT: String(activeRows.length + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: ngayThang,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: ranges[p],
      loaiBan: 'Bản chính',
      ghiChu: '',
      isExcluded: false,
      sourceFileNames: [fn]
    });
  }

  job.data.tenHoSo = 'Hồ sơ về công tác thi đua, khen thưởng của Ủy ban nhân dân xã Phú Lộc năm 2020 (Tập 2)';
  job.data.tieuDeNghiQuyet = job.data.tenHoSo;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Định Quán';
  job.data.donVi = 'UBND xã Phú Lộc';
  job.data.namGiaiDoan = '2020';
  job.data.thoiGianHoSo = 'Từ ngày 20/07/2020 đến ngày 29/12/2020';
  job.data.tongSoToText = `Bản mục lục này gồm ${activeRows.length} văn bản, 194 tờ`;
  job.data.thbq = 'Vĩnh viễn';
  job.data.banTo = 'Văn phòng';
  job.data.rows = activeRows;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  const excelDaCheck = path.join(DA_CHECK_DIR, 'PL_2020_20M.xlsx');
  const excelOcr = path.join(OUTPUT_OCR_DIR, 'PL_2020_20M.xlsx');
  await exportJsonToExcel(job.data, excelDaCheck);
  await exportJsonToExcel(job.data, excelOcr);
  console.log(`Saved 20M Excel files successfully (${activeRows.length} rows, sheets 01-194)`);
}

async function main() {
  await process20M();
  console.log('\n========================================');
  console.log('BATCH 2020-7 PROCESSED AND EXPORTED SUCCESSFULLY!');
  console.log('========================================');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
