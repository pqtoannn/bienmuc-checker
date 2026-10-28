import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function process18G() {
  const dosId = 'PL_2018_18G';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ Công văn (Tập 02) năm 2018 xã Phú Lộc (08/10/2018 đến 26/12/2018)';
  job.data.tieuDeNghiQuyet = 'Hồ sơ Công văn (Tập 02) năm 2018 xã Phú Lộc (08/10/2018 đến 26/12/2018)';
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

  // Build starts array for 376 active documents (002.jpg to 377.jpg)
  const starts = [];
  for (let num = 2; num <= 377; num++) {
    const p = String(num).padStart(3, '0') + '.jpg';
    let s;
    if (num <= 151) {
      s = num - 1; // 002 -> 1, ..., 151 -> 150
    } else if (num === 152) {
      s = 151; // 151 - 153 (3 sheets)
    } else if (num >= 153 && num <= 165) {
      s = 154 + (num - 153); // 153 -> 154, ..., 165 -> 166
    } else if (num === 166) {
      s = 167; // 167 - 168 (2 sheets)
    } else if (num === 167) {
      s = 169; // 169 (1 sheet)
    } else if (num === 168) {
      s = 170; // 170 - 171 (2 sheets)
    } else if (num === 169) {
      s = 172; // 172 (1 sheet)
    } else if (num === 170) {
      s = 173; // 173 - 174 (2 sheets)
    } else if (num === 171) {
      s = 175; // 175 (1 sheet)
    } else if (num >= 172 && num <= 368) {
      s = 176 + (num - 172); // 172 -> 176, ..., 368 -> 372
    } else if (num === 369) {
      s = 373; // 373 - 374 (2 sheets)
    } else if (num === 370) {
      s = 375; // 375 - 376 (2 sheets)
    } else if (num === 371) {
      s = 377; // 377 (1 sheet)
    } else if (num === 372) {
      s = 378; // 378 (1 sheet)
    } else if (num === 373) {
      s = 379; // 379 - 380 (2 sheets)
    } else if (num === 374) {
      s = 381; // 381 (1 sheet)
    } else if (num === 375) {
      s = 382; // 382 (1 sheet)
    } else if (num === 376) {
      s = 383; // 383 (1 sheet)
    } else if (num === 377) {
      s = 384; // 384 (1 sheet)
    }
    starts.push({ p, s, num });
  }

  // Individual specific overrides where OCR had errors or missed handwriting
  const specificOverrides = {
    '152.jpg': { so: '380/HĐ.TĐKT', d: '01/11/2018', tg: 'Ủy ban nhân dân xã Phú Lộc - HĐ.TĐKT xã Phú Lộc' },
    '153.jpg': { so: '381/BCĐ', d: '01/11/2018', tg: 'BCĐ. NNNDNT & XDNTM Xã Phú Lộc' },
    '154.jpg': { so: '382/BCĐ', d: '05/11/2018', tg: 'BCĐ. NNNDNT & XDNTM Xã Phú Lộc' },
    '155.jpg': { so: '383/HĐ.GDQP&AN', d: '08/11/2018', tg: 'Hội đồng GDQP-AN xã Phú Lộc' },
    '156.jpg': { so: '384/UBND', d: '08/11/2018' },
    '157.jpg': { so: '385/UBND', d: '09/11/2018' },
    '158.jpg': { so: '386/UBND', d: '09/11/2018' },
    '159.jpg': { so: '387/UBND', d: '09/11/2018' },
    '160.jpg': { so: '388/UBND', d: '09/11/2018' },
    '161.jpg': { so: '389/UBND', d: '09/11/2018' },
    '162.jpg': { so: '390/UBND', d: '09/11/2018' },
    '163.jpg': { so: '391/UBND', d: '09/11/2018' },
    '164.jpg': { so: '392/UBND', d: '09/11/2018' },
    '165.jpg': { so: '393/UBND', d: '09/11/2018' },
    '166.jpg': { so: '394/HĐ.NVQS', d: '09/11/2018', tg: 'Hội đồng NVQS xã Phú Lộc' },
    '167.jpg': { so: '395/UBND', d: '12/11/2018' },
    '168.jpg': { so: '15/BCĐ', d: '16/11/2018', tg: 'BCĐ. NNNDNT & XDNTM Xã Phú Lộc' },
    '169.jpg': { so: '396/UBND', d: '19/11/2018' },
    '170.jpg': { so: '397/HĐ.NVQS', d: '19/11/2018', tg: 'Hội đồng NVQS xã Phú Lộc' },
    '171.jpg': { so: '01/CV-PCTT', d: '23/11/2018', tg: 'Ban Chỉ huy PCTT-TKCN xã Phú Lộc' },
    '366.jpg': { so: '591/HĐ.NVQS', d: '21/11/2018', tg: 'Hội đồng NVQS xã Phú Lộc' },
    '367.jpg': { so: '592/UBND', d: '05/12/2018' },
    '368.jpg': { so: '593/UBND', d: '05/12/2018' },
    '369.jpg': { so: '594/HĐCS', d: '05/12/2018', tg: 'Hội đồng Chính sách xã Phú Lộc' },
    '370.jpg': { so: '595/HĐCS', d: '05/12/2018', tg: 'Hội đồng Chính sách xã Phú Lộc' },
    '371.jpg': { so: '596/UBND', d: '05/12/2018' },
    '372.jpg': { so: '597/UBND', d: '05/12/2018' },
    '373.jpg': { so: '598/UBND - TĐKT', d: '10/12/2018' },
    '374.jpg': { so: '599/UBND', d: '10/12/2018' },
    '375.jpg': { so: '600/HĐ.NVQS', d: '10/12/2018', tg: 'Hội đồng NVQS xã Phú Lộc' },
    '376.jpg': { so: '601/UBND', d: '14/12/2018' },
    '377.jpg': { so: '602/UBND', d: '24/12/2018' }
  };

  const newRows = [];
  for (let i = 0; i < starts.length; i++) {
    const item = starts[i];
    const p = item.p;
    const num = item.num;
    const startS = item.s;
    const endS = (i < starts.length - 1) ? starts[i + 1].s - 1 : 384;
    const toSo = (startS === endS) ? String(startS).padStart(2, '0') : `${String(startS).padStart(2, '0')} - ${String(endS).padStart(2, '0')}`;

    // Find original row
    const origRow = job.data.rows.find(r => r.sourceFileNames && r.sourceFileNames.includes(p)) || {};

    let so = origRow.soKyHieuVanBan || '';
    let d = origRow.ngayThangVanBan || '';
    let tg = origRow.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc';
    let ty = origRow.tenLoaiTrichYeu || '';

    // Standardize tg
    if (tg.toLowerCase().includes('uỷ')) {
      tg = tg.replace(/uỷ/g, 'ủy').replace(/Uỷ/g, 'Ủy');
    }

    // Consecutive batch 1: 002 to 150
    if (num >= 2 && num <= 150) {
      const calcSo = `${num - 2 + 230}/UBND`;
      so = calcSo;
      d = '08/10/2018';
      tg = 'Ủy ban nhân dân xã Phú Lộc';
    }

    // Consecutive batch 2: 172 to 365
    if (num >= 172 && num <= 365) {
      const calcSo = `${num - 172 + 399}/UBND`;
      so = calcSo;
      if (!d || d.includes('2018') === false || d.includes('/01/') || d.includes('/02/') || d.includes('/04/') || d.includes('/05/') || d.includes('/06/')) {
        d = '26/11/2018';
      }
      tg = 'Ủy ban nhân dân xã Phú Lộc';
    }

    // Apply specific overrides if any
    if (specificOverrides[p]) {
      if (specificOverrides[p].so) so = specificOverrides[p].so;
      if (specificOverrides[p].d) d = specificOverrides[p].d;
      if (specificOverrides[p].tg) tg = specificOverrides[p].tg;
      if (specificOverrides[p].ty) ty = specificOverrides[p].ty;
    }

    newRows.push({
      soTT: String(i + 1),
      soKyHieuVanBan: so,
      ngayThangVanBan: d,
      tenLoaiTrichYeu: ty,
      tacGiaVanBan: tg,
      toSoTrangSo: toSo,
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: [p]
    });
  }

  job.data.rows = newRows;
  job.data.rowsTrung = [];

  // Save updated job.json
  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');
  console.log(`Saved updated job.json to ${jobPath}`);

  // Export to Excel in PL_outputOCR
  const outExcelOcr = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  await exportJsonToExcel(job, outExcelOcr);
  console.log(`Exported Excel to ${outExcelOcr}`);

  // Export to Excel in Da_check
  const outExcelDaCheck = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  await exportJsonToExcel(job, outExcelDaCheck);
  console.log(`Exported Excel to ${outExcelDaCheck}`);
}

process18G().catch(err => {
  console.error('Error processing 18G:', err);
  process.exit(1);
});
