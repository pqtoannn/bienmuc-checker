import fs from 'fs';

const starts = {
  "002.jpg": 1,
  "003.jpg": 3,
  "004.jpg": 5,
  "005.jpg": 6,
  "006.jpg": 7,
  "007.jpg": 10,
  "008.jpg": 11,
  "009.jpg": 15,
  "010.jpg": 16,
  "011.jpg": 17,
  "012.jpg": 18,
  "013.jpg": 20,
  "014.jpg": 23,
  "015.jpg": 26,
  "016.jpg": 27,
  "017.jpg": 28,
  "018.jpg": 29,
  "019.jpg": 30,
  "020.jpg": 31,
  "021.jpg": 34,
  "022.jpg": 35,
  "023.jpg": 40,
  "024.jpg": 53,
  "025.jpg": 54,
  "026.jpg": 55,
  "027.jpg": 57,
  "028.jpg": 58,
  "029.jpg": 60,
  "030.jpg": 62,
  "031.jpg": 63,
  "032.jpg": 66,
  "033.jpg": 70,
  "034.jpg": 71,
  "035.jpg": 73,
  "036.jpg": 75,
  "037.jpg": 78,
  "038.jpg": 85,
  "039.jpg": 91,
  "040.jpg": 92,
  "041.jpg": 94,
  "042.jpg": 97,
  "043.jpg": 103,
  "044.jpg": 105,
  "045.jpg": 109,
  "046.jpg": 115,
  "047.jpg": 116,
  "048.jpg": 121,
  "049.jpg": 123,
  "050.jpg": 124,
  "051.jpg": 126,
  "052.jpg": 128,
  "053.jpg": 130,
  "054.jpg": 134,
  "055.jpg": 135,
  "056.jpg": 138,
  "057.jpg": 140,
  "058.jpg": 146,
  "059.jpg": 149,
  "060.jpg": 152,
  "061.jpg": 153,
  "062.jpg": 156,
  "063.jpg": 158,
  "064.jpg": 162,
  "065.jpg": 163,
  "066.jpg": 164,
  "067.jpg": 165,
  "068.jpg": 166,
  "069.jpg": 167,
  "070.jpg": 168,
  "071.jpg": 170,
  "072.jpg": 173,
  "073.jpg": 177
};

// Calculate ranges
const files = Object.keys(starts).sort();
const ranges = {};
for (let i = 0; i < files.length; i++) {
  const f = files[i];
  const s = starts[f];
  let e;
  if (i < files.length - 1) {
    const nextS = starts[files[i + 1]];
    e = nextS - 1;
  } else {
    // 073 is last, ends at 177
    e = 177;
  }
  ranges[f] = s === e ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')}-${String(e).padStart(2, '0')}`;
}

const jobE = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19E.job.json', 'utf8'));

console.log('File\t\tStart\tRange\tSoHieu\t\tNgay\t\tTrichYeu');
for (const r of jobE.data.rows) {
  const fn = r.sourceFileNames ? r.sourceFileNames[0] : '';
  if (fn === '001.jpg') continue;
  console.log(`${fn}\t${starts[fn]}\t${ranges[fn]}\t${String(r.soKyHieuVanBan || '').padEnd(16)}\t${String(r.ngayThangVanBan || '').padEnd(12)}\t${(r.tenLoaiTrichYeu || '').slice(0, 45)}`);
}
