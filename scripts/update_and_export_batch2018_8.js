import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function process18H() {
  const dosId = 'PL_2018_18H';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ Quyết định năm 2018 xã Phú Lộc (02/01/2018 đến 28/12/2018)';
  job.data.tieuDeNghiQuyet = 'Hồ sơ Quyết định năm 2018 xã Phú Lộc (02/01/2018 đến 28/12/2018)';
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
    { p: '002.jpg', s: 1 }, { p: '003.jpg', s: 3 }, { p: '004.jpg', s: 4 }, { p: '005.jpg', s: 5 }, { p: '006.jpg', s: 6 },
    { p: '007.jpg', s: 7 }, { p: '008.jpg', s: 10 }, { p: '009.jpg', s: 11 }, { p: '010.jpg', s: 12 }, { p: '011.jpg', s: 13 },
    { p: '012.jpg', s: 14 }, { p: '013.jpg', s: 15 }, { p: '014.jpg', s: 16 }, { p: '015.jpg', s: 17 }, { p: '016.jpg', s: 18 },
    { p: '017.jpg', s: 19 }, { p: '018.jpg', s: 20 }, { p: '019.jpg', s: 22 }, { p: '020.jpg', s: 23 }, { p: '021.jpg', s: 24 },
    { p: '022.jpg', s: 25 }, { p: '023.jpg', s: 27 }, { p: '024.jpg', s: 28 }, { p: '025.jpg', s: 29 }, { p: '026.jpg', s: 30 },
    { p: '027.jpg', s: 31 }, { p: '028.jpg', s: 32 }, { p: '029.jpg', s: 33 }, { p: '030.jpg', s: 35 }, { p: '031.jpg', s: 36 },
    { p: '032.jpg', s: 37 }, { p: '033.jpg', s: 38 }, { p: '034.jpg', s: 39 }, { p: '035.jpg', s: 40 }, { p: '036.jpg', s: 41 },
    { p: '037.jpg', s: 42 }, { p: '038.jpg', s: 43 }, { p: '039.jpg', s: 44 }, { p: '040.jpg', s: 45 }, { p: '041.jpg', s: 46 },
    { p: '042.jpg', s: 47 }, { p: '043.jpg', s: 48 }, { p: '044.jpg', s: 49 }, { p: '045.jpg', s: 50 }, { p: '046.jpg', s: 51 },
    { p: '047.jpg', s: 52 }, { p: '048.jpg', s: 53 }, { p: '049.jpg', s: 54 }, { p: '050.jpg', s: 55 }, { p: '051.jpg', s: 56 },
    { p: '052.jpg', s: 57 }, { p: '053.jpg', s: 58 }, { p: '054.jpg', s: 59 }, { p: '055.jpg', s: 60 }, { p: '056.jpg', s: 61 },
    { p: '057.jpg', s: 62 }, { p: '058.jpg', s: 63 }, { p: '059.jpg', s: 64 }, { p: '060.jpg', s: 65 }, { p: '061.jpg', s: 66 },
    { p: '062.jpg', s: 67 }, { p: '063.jpg', s: 68 }, { p: '064.jpg', s: 69 }, { p: '065.jpg', s: 71 }, { p: '066.jpg', s: 77 },
    { p: '067.jpg', s: 80 }, { p: '068.jpg', s: 86 }, { p: '069.jpg', s: 87 }, { p: '070.jpg', s: 89 }, { p: '071.jpg', s: 91 },
    { p: '072.jpg', s: 93 }, { p: '073.jpg', s: 95 }, { p: '074.jpg', s: 96 }, { p: '075.jpg', s: 98 }, { p: '076.jpg', s: 100 },
    { p: '077.jpg', s: 101 }, { p: '078.jpg', s: 102 }, { p: '079.jpg', s: 103 }, { p: '080.jpg', s: 104 }, { p: '081.jpg', s: 105 },
    { p: '082.jpg', s: 111 }, { p: '083.jpg', s: 113 }, { p: '084.jpg', s: 114 }, { p: '085.jpg', s: 116 }, { p: '086.jpg', s: 117 },
    { p: '087.jpg', s: 118 }, { p: '088.jpg', s: 119 }, { p: '089.jpg', s: 120 }, { p: '090.jpg', s: 121 }, { p: '091.jpg', s: 122 },
    { p: '092.jpg', s: 125 }, { p: '093.jpg', s: 126 }, { p: '094.jpg', s: 127 }, { p: '095.jpg', s: 128 }, { p: '096.jpg', s: 129 },
    { p: '097.jpg', s: 130 }, { p: '098.jpg', s: 131 }, { p: '099.jpg', s: 132 }, { p: '100.jpg', s: 133 }, { p: '101.jpg', s: 134 },
    { p: '102.jpg', s: 136 }, { p: '103.jpg', s: 137 }, { p: '104.jpg', s: 140 }, { p: '105.jpg', s: 141 }, { p: '106.jpg', s: 142 },
    { p: '107.jpg', s: 143 }, { p: '108.jpg', s: 144 }, { p: '109.jpg', s: 146 }, { p: '110.jpg', s: 147 }, { p: '111.jpg', s: 149 },
    { p: '112.jpg', s: 151 }, { p: '113.jpg', s: 153 }, { p: '114.jpg', s: 155 }, { p: '115.jpg', s: 156 }, { p: '116.jpg', s: 157 },
    { p: '117.jpg', s: 158 }, { p: '118.jpg', s: 160 }, { p: '119.jpg', s: 162 }, { p: '120.jpg', s: 163 }, { p: '121.jpg', s: 164 },
    { p: '122.jpg', s: 166 }, { p: '123.jpg', s: 167 }, { p: '124.jpg', s: 168 }, { p: '125.jpg', s: 169 }, { p: '126.jpg', s: 170 },
    { p: '127.jpg', s: 172 }, { p: '128.jpg', s: 173 }, { p: '129.jpg', s: 175 }, { p: '130.jpg', s: 176 }, { p: '131.jpg', s: 177 },
    { p: '132.jpg', s: 179 }, { p: '133.jpg', s: 180 }, { p: '134.jpg', s: 181 }, { p: '135.jpg', s: 182 }, { p: '136.jpg', s: 183 },
    { p: '137.jpg', s: 185 }, { p: '138.jpg', s: 187 }, { p: '139.jpg', s: 189 }, { p: '140.jpg', s: 191 }, { p: '141.jpg', s: 199 }
  ];

  // Specific overrides for OCR misreads
  const overrides = {
    '008.jpg': { so: '06/QĐ-UBND', d: '12/01/2018' },
    '016.jpg': { so: '12/QĐ-UBND', d: '02/02/2018' },
    '020.jpg': { so: '15/QĐ-UBND', d: '28/02/2018' },
    '022.jpg': { so: '17/QĐ-UBND', d: '08/03/2018' },
    '026.jpg': { so: '21/QĐ-UBND', d: '27/03/2018' },
    '028.jpg': { so: '23/QĐ-UBND', d: '27/03/2018' },
    '029.jpg': { so: '24/QĐ-UBND', d: '29/03/2018' },
    '109.jpg': { so: '100/QĐ-UBND', d: '21/08/2018' },
    '110.jpg': { so: '101/QĐ-UBND', d: '23/08/2018' },
    '114.jpg': { so: '103/QĐ-UBND', d: '23/09/2018' },
    '117.jpg': { so: '108/QĐ-UBND', d: '28/09/2018' },
    '119.jpg': { so: '110/QĐ-UBND', d: '08/10/2018' },
    '121.jpg': { so: '112/QĐ-UBND', d: '09/10/2018' },
    '122.jpg': { so: '110/QĐ-UBND', d: '16/10/2018' },
    '124.jpg': { tg: 'Ủy ban nhân dân xã Phú Lộc' },
    '130.jpg': { so: '121/QĐ-UBND', d: '19/11/2018' },
    '132.jpg': { so: '123/QĐ-UBND', d: '29/11/2018' },
    '135.jpg': { so: '126/QĐ-UBND', d: '03/12/2018' },
    '140.jpg': { so: '122/QĐ-UBND', d: '28/12/2018' },
    '141.jpg': { so: '123/QĐ-UBND', d: '28/12/2018' }
  };

  const newRows = [];
  for (let i = 0; i < starts.length; i++) {
    const item = starts[i];
    const p = item.p;
    const startS = item.s;
    const endS = (i < starts.length - 1) ? starts[i + 1].s - 1 : 199;
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

process18H().catch(err => {
  console.error('Error processing 18H:', err);
  process.exit(1);
});
