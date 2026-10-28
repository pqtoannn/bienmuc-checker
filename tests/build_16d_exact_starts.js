import ExcelJS from 'exceljs';
import fs from 'fs';

function formatRange(start, end) {
  const sStr = String(start).padStart(2, '0');
  if (start === end) return sStr;
  const eStr = String(end).padStart(2, '0');
  return `${sStr}-${eStr}`;
}

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16D.xlsx');
  const ws = wb.worksheets[0];

  // Map each image to its physically verified start:
  const map = {
    "002.jpg": 1,
    "003.jpg": 2,
    "004.jpg": 3,
    "005.jpg": 4,
    "006.jpg": 5,
    "007.jpg": 7,
    "008.jpg": 9,
    "009.jpg": 10,
    "010.jpg": 11,
    "011.jpg": 12,
    "012.jpg": 13,
    "013.jpg": 14,
    "014.jpg": 16,
    "015.jpg": 18,
    "016.jpg": 25,
    "017.jpg": 26,
    "018.jpg": 27,
    "019.jpg": 28,
    "020.jpg": 33,
    "021.jpg": 34,
    "022.jpg": 37,
    "023.jpg": 40,
    "024.jpg": 41,
    "025.jpg": 45,
    "026.jpg": 50,
    "027.jpg": 55,
    "028.jpg": 56,
    "029.jpg": 57,
    "030.jpg": 58,
    "031.jpg": 59,
    "032.jpg": 60,
    "033.jpg": 61,
    "034.jpg": 62,
    "035.jpg": 63,
    "036.jpg": 64,
    "037.jpg": 65,
    "038.jpg": 66,
    "039.jpg": 67,
    "040.jpg": 68,
    "041.jpg": 70,
    "042.jpg": 72,
    "043.jpg": 73,
    "044.jpg": 74,
    "045.jpg": 75,
    "046.jpg": 76,
    "047.jpg": 80,
    "048.jpg": 83,
    "049.jpg": 84,
    "050.jpg": 85,
    "051.jpg": 86,
    "052.jpg": 87,
    "053.jpg": 89,
    "054.jpg": 90,
    "055.jpg": 91,
    "056.jpg": 92,
    "057.jpg": 96,
    "058.jpg": 97,
    "059.jpg": 98,
    "060.jpg": 99,
    "061.jpg": 101,
    "062.jpg": 102,
    "063.jpg": 103,
    "064.jpg": 105,
    "065.jpg": 106,
    "066.jpg": 107,
    "067.jpg": 108,
    "068.jpg": 109,
    "069.jpg": 110,
    "070.jpg": 111,
    "071.jpg": 114,
    "072.jpg": 118,
    "073.jpg": 121,
    "074.jpg": 122,
    "075.jpg": 123,
    "076.jpg": 125,
    "077.jpg": 126,
    "078.jpg": 128,
    "079.jpg": 129,
    "080.jpg": 130,
    "081.jpg": 131,
    "082.jpg": 132,
    "083.jpg": 135, // wait, let's verify map around 080-085
  };
}
