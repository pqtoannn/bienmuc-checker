import fs from 'fs';
import path from 'path';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function process18A() {
  const dosId = 'PL_2018_18A';
  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));

  job.data.tenHoSo = 'Hồ sơ Công văn (Tập 01) năm 2018 xã Phú Lộc (02/01/2018 đến 24/09/2018)';
  job.data.tieuDeNghiQuyet = 'Hồ sơ Công văn (Tập 01) năm 2018 xã Phú Lộc (02/01/2018 đến 24/09/2018)';
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

  const starts = [
    // 003 to 027 (idx 0 to 24)
    { p: '003.jpg', s: 1 }, { p: '004.jpg', s: 3 }, { p: '005.jpg', s: 4 }, { p: '006.jpg', s: 7 }, { p: '007.jpg', s: 8 },
    { p: '008.jpg', s: 10 }, { p: '009.jpg', s: 11 }, { p: '010.jpg', s: 12 }, { p: '011.jpg', s: 13 }, { p: '012.jpg', s: 14 },
    { p: '013.jpg', s: 15 }, { p: '014.jpg', s: 16 }, { p: '015.jpg', s: 17 }, { p: '016.jpg', s: 18 }, { p: '017.jpg', s: 19 },
    { p: '018.jpg', s: 20 }, { p: '019.jpg', s: 21 }, { p: '020.jpg', s: 22 }, { p: '021.jpg', s: 23 }, { p: '022.jpg', s: 24 },
    { p: '023.jpg', s: 25 }, { p: '024.jpg', s: 26 }, { p: '025.jpg', s: 27 }, { p: '026.jpg', s: 38 }, { p: '027.jpg', s: 39 },

    // 028 to 052 (idx 25 to 49)
    { p: '028.jpg', s: 40 }, { p: '029.jpg', s: 42 }, { p: '030.jpg', s: 43 }, { p: '031.jpg', s: 44 }, { p: '032.jpg', s: 45 },
    { p: '033.jpg', s: 46 }, { p: '034.jpg', s: 47 }, { p: '035.jpg', s: 48 }, { p: '036.jpg', s: 49 }, { p: '037.jpg', s: 50 },
    { p: '038.jpg', s: 51 }, { p: '039.jpg', s: 52 }, { p: '040.jpg', s: 53 }, { p: '041.jpg', s: 54 }, { p: '042.jpg', s: 55 },
    { p: '043.jpg', s: 56 }, { p: '044.jpg', s: 57 }, { p: '045.jpg', s: 58 }, { p: '046.jpg', s: 59 }, { p: '047.jpg', s: 60 },
    { p: '048.jpg', s: 61 }, { p: '049.jpg', s: 68 }, { p: '050.jpg', s: 71 }, { p: '051.jpg', s: 72 }, { p: '052.jpg', s: 73 },

    // 053 to 077 (idx 50 to 74)
    { p: '053.jpg', s: 76 }, { p: '054.jpg', s: 77 }, { p: '055.jpg', s: 78 }, { p: '056.jpg', s: 81 }, { p: '057.jpg', s: 82 },
    { p: '058.jpg', s: 83 }, { p: '059.jpg', s: 84 }, { p: '060.jpg', s: 85 }, { p: '061.jpg', s: 86 }, { p: '062.jpg', s: 87 },
    { p: '063.jpg', s: 88 }, { p: '064.jpg', s: 89 }, { p: '065.jpg', s: 90 }, { p: '066.jpg', s: 91 }, { p: '067.jpg', s: 92 },
    { p: '068.jpg', s: 93 }, { p: '069.jpg', s: 94 }, { p: '070.jpg', s: 95 }, { p: '071.jpg', s: 96 }, { p: '072.jpg', s: 97 },
    { p: '073.jpg', s: 98 }, { p: '074.jpg', s: 99 }, { p: '075.jpg', s: 100 }, { p: '076.jpg', s: 101 }, { p: '077.jpg', s: 102 },

    // 078 to 102 (idx 75 to 99)
    { p: '078.jpg', s: 103 }, { p: '079.jpg', s: 104 }, { p: '080.jpg', s: 105 }, { p: '081.jpg', s: 107 }, { p: '082.jpg', s: 108 },
    { p: '083.jpg', s: 109 }, { p: '084.jpg', s: 110 }, { p: '085.jpg', s: 111 }, { p: '086.jpg', s: 112 }, { p: '087.jpg', s: 113 },
    { p: '088.jpg', s: 114 }, { p: '089.jpg', s: 115 }, { p: '090.jpg', s: 116 }, { p: '091.jpg', s: 117 }, { p: '092.jpg', s: 118 },
    { p: '093.jpg', s: 119 }, { p: '094.jpg', s: 120 }, { p: '095.jpg', s: 121 }, { p: '096.jpg', s: 122 }, { p: '097.jpg', s: 123 },
    { p: '098.jpg', s: 124 }, { p: '099.jpg', s: 125 }, { p: '100.jpg', s: 126 }, { p: '101.jpg', s: 127 }, { p: '102.jpg', s: 128 },

    // 103 to 127 (idx 100 to 124)
    { p: '103.jpg', s: 129 }, { p: '104.jpg', s: 130 }, { p: '105.jpg', s: 131 }, { p: '106.jpg', s: 132 }, { p: '107.jpg', s: 133 },
    { p: '108.jpg', s: 134 }, { p: '109.jpg', s: 135 }, { p: '110.jpg', s: 136 }, { p: '111.jpg', s: 137 }, { p: '112.jpg', s: 138 },
    { p: '113.jpg', s: 139 }, { p: '114.jpg', s: 140 }, { p: '115.jpg', s: 141 }, { p: '116.jpg', s: 142 }, { p: '117.jpg', s: 143 },
    { p: '118.jpg', s: 144 }, { p: '119.jpg', s: 145 }, { p: '120.jpg', s: 146 }, { p: '121.jpg', s: 147 }, { p: '122.jpg', s: 148 },
    { p: '123.jpg', s: 149 }, { p: '124.jpg', s: 150 }, { p: '125.jpg', s: 151 }, { p: '126.jpg', s: 152 }, { p: '127.jpg', s: 153 },

    // 128 to 152 (idx 125 to 149)
    { p: '128.jpg', s: 154 }, { p: '129.jpg', s: 155 }, { p: '130.jpg', s: 156 }, { p: '131.jpg', s: 157 }, { p: '132.jpg', s: 158 },
    { p: '133.jpg', s: 159 }, { p: '134.jpg', s: 160 }, { p: '135.jpg', s: 161 }, { p: '136.jpg', s: 162 }, { p: '137.jpg', s: 163 },
    { p: '138.jpg', s: 164 }, { p: '139.jpg', s: 165 }, { p: '140.jpg', s: 166 }, { p: '141.jpg', s: 167 }, { p: '142.jpg', s: 168 },
    { p: '143.jpg', s: 169 }, { p: '144.jpg', s: 170 }, { p: '145.jpg', s: 173 }, { p: '146.jpg', s: 174 }, { p: '147.jpg', s: 176 },
    { p: '148.jpg', s: 178 }, { p: '149.jpg', s: 182 }, { p: '150.jpg', s: 183 }, { p: '151.jpg', s: 184 }, { p: '152.jpg', s: 185 },

    // 153 to 177 (idx 150 to 174)
    { p: '153.jpg', s: 186 }, { p: '154.jpg', s: 187 }, { p: '155.jpg', s: 188 }, { p: '156.jpg', s: 189 }, { p: '157.jpg', s: 191 },
    { p: '158.jpg', s: 193 }, { p: '159.jpg', s: 194 }, { p: '160.jpg', s: 195 }, { p: '161.jpg', s: 196 }, { p: '162.jpg', s: 197 },
    { p: '163.jpg', s: 198 }, { p: '164.jpg', s: 199 }, { p: '165.jpg', s: 200 }, { p: '166.jpg', s: 201 }, { p: '167.jpg', s: 202 },
    { p: '168.jpg', s: 203 }, { p: '169.jpg', s: 204 }, { p: '170.jpg', s: 205 }, { p: '171.jpg', s: 206 }, { p: '172.jpg', s: 207 },
    { p: '173.jpg', s: 208 }, { p: '174.jpg', s: 209 }, { p: '175.jpg', s: 210 }, { p: '176.jpg', s: 211 }, { p: '177.jpg', s: 212 },

    // 178 to 202 (idx 175 to 199)
    { p: '178.jpg', s: 213 }, { p: '179.jpg', s: 214 }, { p: '180.jpg', s: 215 }, { p: '181.jpg', s: 216 }, { p: '182.jpg', s: 217 },
    { p: '183.jpg', s: 218 }, { p: '184.jpg', s: 219 }, { p: '185.jpg', s: 220 }, { p: '186.jpg', s: 221 }, { p: '187.jpg', s: 222 },
    { p: '188.jpg', s: 223 }, { p: '189.jpg', s: 224 }, { p: '190.jpg', s: 225 }, { p: '191.jpg', s: 226 }, { p: '192.jpg', s: 227 },
    { p: '193.jpg', s: 228 }, { p: '194.jpg', s: 229 }, { p: '195.jpg', s: 230 }, { p: '196.jpg', s: 231 }, { p: '197.jpg', s: 232 },
    { p: '198.jpg', s: 233 }, { p: '199.jpg', s: 234 }, { p: '200.jpg', s: 235 }, { p: '201.jpg', s: 236 }, { p: '202.jpg', s: 237 },

    // 203 to 227 (idx 200 to 224)
    { p: '203.jpg', s: 238 }, { p: '204.jpg', s: 239 }, { p: '205.jpg', s: 240 }, { p: '206.jpg', s: 241 }, { p: '207.jpg', s: 242 },
    { p: '208.jpg', s: 243 }, { p: '209.jpg', s: 244 }, { p: '210.jpg', s: 245 }, { p: '211.jpg', s: 246 }, { p: '212.jpg', s: 247 },
    { p: '213.jpg', s: 248 }, { p: '214.jpg', s: 249 }, { p: '215.jpg', s: 250 }, { p: '216.jpg', s: 251 }, { p: '217.jpg', s: 252 },
    { p: '218.jpg', s: 253 }, { p: '219.jpg', s: 254 }, { p: '220.jpg', s: 255 }, { p: '221.jpg', s: 256 }, { p: '222.jpg', s: 257 },
    { p: '223.jpg', s: 258 }, { p: '224.jpg', s: 259 }, { p: '225.jpg', s: 260 }, { p: '226.jpg', s: 261 }, { p: '227.jpg', s: 262 },

    // 228 to 231 (idx 225 to 228)
    { p: '228.jpg', s: 263 }, { p: '229.jpg', s: 264 }, { p: '230.jpg', s: 265 }, { p: '231.jpg', s: 266 }
  ];

  // Specific overrides for OCR misreads
  const overrides = {
    '014.jpg': { so: '11/UBND', d: '18/01/2018' },
    '015.jpg': { so: '12/UBND', d: '29/01/2018' },
    '024.jpg': { so: '20/UBND', d: '01/03/2018' },
    '025.jpg': { so: '21/UBND', d: '07/03/2018' },
    '026.jpg': { so: '22/UBND', d: '12/03/2018' },
    '027.jpg': { so: '23/UBND', d: '16/03/2018' },
    '202.jpg': { so: '198/UBND', d: '13/09/2018' },
    '203.jpg': { so: '199/UBND', d: '13/09/2018' },
    '204.jpg': { so: '200/UBND', d: '13/09/2018' },
    '205.jpg': { so: '201/UBND', d: '13/09/2018' },
    '206.jpg': { so: '203/UBND', d: '13/09/2018' },
    '207.jpg': { so: '204/UBND', d: '13/09/2018' },
    '208.jpg': { so: '205/UBND', d: '13/09/2018' },
    '222.jpg': { so: '219/UBND', d: '13/09/2018' }
  };

  const newRows = [];
  for (let i = 0; i < starts.length; i++) {
    const item = starts[i];
    const p = item.p;
    const startS = item.s;
    const endS = (i < starts.length - 1) ? starts[i + 1].s - 1 : 266;
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

process18A().catch(err => {
  console.error('Error processing 18A:', err);
  process.exit(1);
});
