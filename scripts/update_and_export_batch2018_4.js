import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function process18B() {
  const dosId = 'PL_2018_18B';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ Kế hoạch năm 2018 xã Phú Lộc (02/01/2018 đến 25/12/2018)';
  job.data.tieuDeNghiQuyet = 'Hồ sơ Kế hoạch năm 2018 xã Phú Lộc (02/01/2018 đến 25/12/2018)';
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

  // Define exact 89 active rows (photos 002.jpg to 090.jpg, with 091.jpg merged into 090.jpg)
  const starts = [
    { p: '002.jpg', s: 1 },
    { p: '003.jpg', s: 7 },
    { p: '004.jpg', s: 8 },
    { p: '005.jpg', s: 10 },
    { p: '006.jpg', s: 12 },
    { p: '007.jpg', s: 13 },
    { p: '008.jpg', s: 15 },
    { p: '009.jpg', s: 16 },
    { p: '010.jpg', s: 18 },
    { p: '011.jpg', s: 20 },
    { p: '012.jpg', s: 21 },
    { p: '013.jpg', s: 22 },
    { p: '014.jpg', s: 24 },
    { p: '015.jpg', s: 26 },
    { p: '016.jpg', s: 28 },
    { p: '017.jpg', s: 31 },
    { p: '018.jpg', s: 34 },
    { p: '019.jpg', s: 36 },
    { p: '020.jpg', s: 37 },
    { p: '021.jpg', s: 39 },
    { p: '022.jpg', s: 41, so: '17/KH-UBND', d: '28/03/2018' },
    { p: '023.jpg', s: 43 },
    { p: '024.jpg', s: 45 },
    { p: '025.jpg', s: 47, so: '18/KH-UBND', d: '07/03/2018' },
    { p: '026.jpg', s: 49 },
    { p: '027.jpg', s: 51, so: '19/KH-UBND', d: '20/03/2018' },
    { p: '028.jpg', s: 52 },
    { p: '029.jpg', s: 54 },
    { p: '030.jpg', s: 55 },
    { p: '031.jpg', s: 56 },
    { p: '032.jpg', s: 58 },
    { p: '033.jpg', s: 61 },
    { p: '034.jpg', s: 63 },
    { p: '035.jpg', s: 65 },
    { p: '036.jpg', s: 67 },
    { p: '037.jpg', s: 73 },
    { p: '038.jpg', s: 77 },
    { p: '039.jpg', s: 79 },
    { p: '040.jpg', s: 83 },
    { p: '041.jpg', s: 86 },
    { p: '042.jpg', s: 88 },
    { p: '043.jpg', s: 93 },
    { p: '044.jpg', s: 94 },
    { p: '045.jpg', s: 95 },
    { p: '046.jpg', s: 96 },
    { p: '047.jpg', s: 97 },
    { p: '048.jpg', s: 100 },
    { p: '049.jpg', s: 102 },
    { p: '050.jpg', s: 104 },
    { p: '051.jpg', s: 107 },
    { p: '052.jpg', s: 109 },
    { p: '053.jpg', s: 110 },
    { p: '054.jpg', s: 112 },
    { p: '055.jpg', s: 115 },
    { p: '056.jpg', s: 117 },
    { p: '057.jpg', s: 119 },
    { p: '058.jpg', s: 121 },
    { p: '059.jpg', s: 123 },
    { p: '060.jpg', s: 126 },
    { p: '061.jpg', s: 129 },
    { p: '062.jpg', s: 131 },
    { p: '063.jpg', s: 134 },
    { p: '064.jpg', s: 135 },
    { p: '065.jpg', s: 138 },
    { p: '066.jpg', s: 139 },
    { p: '067.jpg', s: 140, so: '57/KH-UBND', d: '16/08/2018' },
    { p: '068.jpg', s: 141 },
    { p: '069.jpg', s: 143 },
    { p: '070.jpg', s: 145, so: '60/KH-UBND', d: '07/09/2018' },
    { p: '071.jpg', s: 146 },
    { p: '072.jpg', s: 148, so: '62/KH-UBND', d: '25/09/2018' },
    { p: '073.jpg', s: 150, so: '64/KH-UBND', d: '27/09/2018' },
    { p: '074.jpg', s: 151 },
    { p: '075.jpg', s: 152 },
    { p: '076.jpg', s: 155 },
    { p: '077.jpg', s: 157 },
    { p: '078.jpg', s: 161 },
    { p: '079.jpg', s: 163 },
    { p: '080.jpg', s: 165 },
    { p: '081.jpg', s: 169, so: '73/KH-HĐNVQS', d: '07/11/2018' },
    { p: '082.jpg', s: 171, so: '74/KH-HĐNVQS', d: '14/11/2018' },
    { p: '083.jpg', s: 173 },
    { p: '084.jpg', s: 175, so: '76/KH-BCĐ', d: '23/11/2018' },
    { p: '085.jpg', s: 178 },
    { p: '086.jpg', s: 180, so: '78/KH-UBND', d: '07/12/2018' },
    { p: '087.jpg', s: 182 },
    { p: '088.jpg', s: 185 },
    { p: '089.jpg', s: 187, so: '81/KH-HĐ.NVQS', d: '10/12/2018' },
    { p: '090.jpg', s: 190, finalEnd: 192 }
  ];

  const rawRows = job.data.rows || [];
  const activeRows = [];

  for (let i = 0; i < starts.length; i++) {
    const cur = starts[i];
    const s = cur.s;
    const nextStart = i < starts.length - 1 ? starts[i + 1].s : (cur.finalEnd + 1);
    const end = nextStart - 1;
    const range = s === end ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')} - ${String(end).padStart(2, '0')}`;

    // Find corresponding raw row
    const raw = rawRows.find(r => r.sourceFileNames && r.sourceFileNames.includes(cur.p)) || {};

    const soKyHieu = cur.so || raw.soKyHieuVanBan || '';
    const ngayThang = cur.d || raw.ngayThangVanBan || '';
    const tacGia = raw.tacGiaVanBan || 'Ủy ban nhân dân xã Phú Lộc';
    const trichYeu = raw.tenLoaiTrichYeu || '';

    const newRow = {
      soTT: String(i + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: ngayThang,
      tenLoaiTrichYeu: trichYeu,
      tacGiaVanBan: tacGia,
      toSoTrangSo: range,
      loaiBan: 'Bản gốc',
      ghiChu: '',
      banGocChinh: 'Bản gốc',
      banSao: '',
      doMat: '',
      sourceFileNames: cur.p === '090.jpg' ? ['090.jpg', '091.jpg'] : [cur.p]
    };
    activeRows.push(newRow);
  }

  // Update image 091.jpg metadata
  const img91 = job.images.find(img => img.fileName === '091.jpg');
  if (img91) {
    img91.status = 'merged';
    img91.mergeWith = '090.jpg';
    img91.notes = 'Trang 3/3 của Kế hoạch 82/KH-UBND';
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
}

process18B().catch(err => {
  console.error('Error processing 18B:', err);
  process.exit(1);
});
