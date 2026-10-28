import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function process18F() {
  const dosId = 'PL_2018_18F';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ Tờ trình năm 2018 xã Phú Lộc';
  job.data.tieuDeNghiQuyet = 'Hồ sơ Tờ trình năm 2018 xã Phú Lộc';
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

  const starts = [
    { p: '002.jpg', s: 1 }, { p: '003.jpg', s: 2 }, { p: '004.jpg', s: 3 }, { p: '005.jpg', s: 4 },
    { p: '006.jpg', s: 5 }, { p: '007.jpg', s: 7 }, { p: '008.jpg', s: 8 }, { p: '009.jpg', s: 9 },
    { p: '010.jpg', s: 10 }, { p: '011.jpg', s: 12 }, { p: '012.jpg', s: 13 }, { p: '013.jpg', s: 14 },
    { p: '014.jpg', s: 15 }, { p: '015.jpg', s: 16 }, { p: '016.jpg', s: 19 }, { p: '017.jpg', s: 25 },
    { p: '018.jpg', s: 28 }, { p: '019.jpg', s: 32 }, { p: '020.jpg', s: 34 }, { p: '021.jpg', s: 35 },
    { p: '022.jpg', s: 36 }, { p: '023.jpg', s: 37 }, { p: '024.jpg', s: 38 }, { p: '025.jpg', s: 39 },
    { p: '026.jpg', s: 44 }, { p: '027.jpg', s: 47 }, { p: '028.jpg', s: 52 }, { p: '029.jpg', s: 54 },
    { p: '030.jpg', s: 56 }, { p: '031.jpg', s: 59 }, { p: '032.jpg', s: 60 }, { p: '033.jpg', s: 63 },
    { p: '034.jpg', s: 64 }, { p: '035.jpg', s: 65 }, { p: '036.jpg', s: 68 }, { p: '037.jpg', s: 71 },
    { p: '038.jpg', s: 72 }, { p: '039.jpg', s: 73 }, { p: '040.jpg', s: 79 }, { p: '041.jpg', s: 87 },
    { p: '042.jpg', s: 88 }, { p: '043.jpg', s: 92 }, { p: '044.jpg', s: 93 }, { p: '045.jpg', s: 94 },
    { p: '046.jpg', s: 95 }, { p: '047.jpg', s: 96 }, { p: '048.jpg', s: 97 }, { p: '049.jpg', s: 98 },
    { p: '050.jpg', s: 99 }, { p: '051.jpg', s: 100 }, { p: '052.jpg', s: 101 }, { p: '053.jpg', s: 102 },
    { p: '054.jpg', s: 103 }, { p: '055.jpg', s: 104 }, { p: '056.jpg', s: 105 }, { p: '057.jpg', s: 106 },
    { p: '058.jpg', s: 107 }, { p: '059.jpg', s: 108 }, { p: '060.jpg', s: 109 }, { p: '061.jpg', s: 110 },
    { p: '062.jpg', s: 111 }, { p: '063.jpg', s: 112 }, { p: '064.jpg', s: 115 }, { p: '065.jpg', s: 120 },
    { p: '066.jpg', s: 121 }, { p: '067.jpg', s: 122 }, { p: '068.jpg', s: 123 }, { p: '069.jpg', s: 129 },
    { p: '070.jpg', s: 134 }, { p: '071.jpg', s: 135 }, { p: '072.jpg', s: 136 }, { p: '073.jpg', s: 137 },
    { p: '074.jpg', s: 138 }, { p: '075.jpg', s: 139 }, { p: '076.jpg', s: 140 }, { p: '077.jpg', s: 141 },
    { p: '078.jpg', s: 148 }, { p: '079.jpg', s: 149 }, { p: '080.jpg', s: 150 }, { p: '081.jpg', s: 151 },
    { p: '082.jpg', s: 152 }, { p: '083.jpg', s: 153 }, { p: '084.jpg', s: 159 }, { p: '085.jpg', s: 160 },
    { p: '086.jpg', s: 173 }, { p: '087.jpg', s: 174 }, { p: '088.jpg', s: 177 }, { p: '089.jpg', s: 178 },
    { p: '090.jpg', s: 179 }, { p: '091.jpg', s: 180 }, { p: '092.jpg', s: 188 }, { p: '093.jpg', s: 189 },
    { p: '094.jpg', s: 196 }, { p: '095.jpg', s: 197 }, { p: '096.jpg', s: 198 }, { p: '097.jpg', s: 199 },
    { p: '098.jpg', s: 200 }, { p: '099.jpg', s: 201 }, { p: '100.jpg', s: 202 }, { p: '101.jpg', s: 203 },
    { p: '102.jpg', s: 207 }, { p: '103.jpg', s: 208 }, { p: '104.jpg', s: 209 }, { p: '105.jpg', s: 210 },
    { p: '106.jpg', s: 211 }, { p: '107.jpg', s: 212 }, { p: '108.jpg', s: 213 }, { p: '109.jpg', s: 214 },
    { p: '110.jpg', s: 215 }, { p: '111.jpg', s: 218 }, { p: '112.jpg', s: 219 }
  ];

  // Specific overrides for OCR misreads
  const overrides = {
    '008.jpg': { so: '08/TTr-UBND', d: '17/01/2018' },
    '011.jpg': { so: '10/TTr-UBND', d: '22/01/2018' },
    '013.jpg': { so: '12/TTr-UBND', d: '01/02/2018' },
    '018.jpg': { so: '17/TTr-UBND', d: '07/03/2018' },
    '026.jpg': { so: '19/TTr-UBND', d: '21/03/2018' },
    '028.jpg': { so: '27/TTr-UBND', d: '26/03/2018' },
    '030.jpg': { so: '29/TTr-UBND', d: '27/03/2018' },
    '032.jpg': { so: '31/TTr-UBND', d: '11/04/2018' },
    '035.jpg': { so: '33/TTr-UBND', d: '15/04/2018' },
    '079.jpg': { so: '77/TTr-UBND', d: '23/07/2018' },
    '080.jpg': { so: '79/TTr-UBND', d: '01/08/2018' },
    '081.jpg': { so: '80/TTr-UBND', d: '01/08/2018' },
    '082.jpg': { so: '81/TTr-UBND', d: '03/08/2018' },
    '083.jpg': { so: '82/TTr-UBND', d: '13/08/2018' },
    '085.jpg': { so: '84/TTr-UBND', d: '15/08/2018' },
    '091.jpg': { so: '91/TTr-UBND', d: '29/10/2018' },
    '096.jpg': { so: '96/TTr-UBND', d: '07/11/2018' },
    '098.jpg': { so: '98/TTr-UBND', d: '16/11/2018' },
    '102.jpg': { so: '102/TTr-UBND', d: '24/11/2018' },
    '103.jpg': { so: '103/TTr-UBND', d: '30/11/2018' },
    '106.jpg': { so: '107/TTr-UBND', d: '14/12/2018' },
    '107.jpg': { so: '108/TTr-UBND', d: '18/12/2018' },
    '109.jpg': { so: '110/TTr-UBND', d: '18/12/2018' },
    '110.jpg': { so: '111/TTr-UBND', d: '18/12/2018' },
    '111.jpg': { so: '113/TTr-UBND', d: '24/12/2018' },
    '112.jpg': { so: '114/TTr-UBND', d: '26/12/2018' }
  };

  const newRows = [];
  for (let i = 0; i < starts.length; i++) {
    const item = starts[i];
    const p = item.p;
    const startS = item.s;
    const endS = (i < starts.length - 1) ? starts[i + 1].s - 1 : 219;
    const toSo = (startS === endS) ? String(startS).padStart(2, '0') : `${String(startS).padStart(2, '0')} - ${String(endS).padStart(2, '0')}`;

    // Find original row in job.data.rows
    const origRow = job.data.rows.find(r => r.sourceFileNames && r.sourceFileNames.includes(p)) || {};

    let so = origRow.soKyHieuVanBan || '';
    let d = origRow.ngayThangVanBan || '';
    let tg = origRow.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc';
    let ty = origRow.tenLoaiTrichYeu || '';

    // Standardize tg
    if (tg.toLowerCase().includes('uỷ')) {
      tg = tg.replace(/uỷ/g, 'uỷ').replace(/Uỷ/g, 'Ủy');
    }

    if (overrides[p]) {
      if (overrides[p].so) so = overrides[p].so;
      if (overrides[p].d) d = overrides[p].d;
      if (overrides[p].tg) tg = overrides[p].tg;
      if (overrides[p].ty) ty = overrides[p].ty;
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

process18F().catch(err => {
  console.error('Error processing 18F:', err);
  process.exit(1);
});
