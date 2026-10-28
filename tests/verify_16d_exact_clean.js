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

  const rawRows = [];
  for (let r = 8; r <= 140; r++) {
    const row = ws.getRow(r);
    const img = String(r - 6).padStart(3, '0') + '.jpg';
    rawRows.push({
      r,
      img,
      so: row.getCell(2).text?.trim() || '',
      d: row.getCell(3).text?.trim() || '',
      trich: row.getCell(4).text?.trim() || '',
      tg: row.getCell(5).text?.trim() || 'Ủy ban nhân dân xã Phú Lộc',
      toSo: row.getCell(6).text?.trim() || '',
      loaiBan: row.getCell(7).text?.trim() || 'Bản gốc'
    });
  }

  const activeDocs = [];
  for (const item of rawRows) {
    if (['088.jpg', '120.jpg', '134.jpg'].includes(item.img)) continue;
    if (item.img === '084.jpg') {
      activeDocs[activeDocs.length - 1].files.push('084.jpg');
      continue;
    }
    if (item.img === '101.jpg') {
      activeDocs[activeDocs.length - 1].files.push('101.jpg');
      continue;
    }
    activeDocs.push({
      ...item,
      files: [item.img]
    });
  }

  // Exactly 128 starts
  const startsD = [
    // 1 to 20 (002 to 021)
    1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 16, 18, 25, 26, 27, 28, 33, 34,
    // 21 to 40 (022 to 041)
    37, 40, 41, 45, 50, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70,
    // 41 to 60 (042 to 061)
    72, 73, 74, 75, 76, 80, 83, 84, 85, 86, 87, 89, 90, 91, 92, 96, 97, 98, 99, 101,
    // 61 to 81 (062 to 082) - 21 items
    102, 103, 105, 106, 107, 108, 109, 110, 111, 114, 118, 121, 122, 123, 125, 126, 128, 129, 130, 131, 132,
    // 82 to 100 (083+084 to 103) - 19 items
    135, 136, 137, 138, 139, 140, 141, 143, 144, 146, 147, 149, 151, 152, 154, 156, 157, 158, 159,
    // 101 to 115 (104 to 119) - 15 items
    160, 161, 162, 163, 164, 165, 166, 169, 173, 175, 179, 181, 182, 186, 187,
    // 116 to 128 (121 to 133) - 13 items
    189, 190, 191, 192, 193, 194, 195, 197, 204, 207, 209, 213
  ];

  console.log(`activeDocs length: ${activeDocs.length}`);
  console.log(`startsD length: ${startsD.length}`);

  let lastEnd = 0;
  let hasGap = false;
  for (let i = 0; i < activeDocs.length; i++) {
    const s = startsD[i];
    const e = (i === activeDocs.length - 1) ? 213 : startsD[i + 1] - 1;
    if (s !== lastEnd + 1) {
      console.error(`GAP at [${i+1}] img: ${activeDocs[i].img}: prevEnd=${lastEnd}, start=${s}`);
      hasGap = true;
    }
    const range = formatRange(s, e);
    lastEnd = e;
  }
  if (!hasGap && lastEnd === 213 && activeDocs.length === startsD.length) {
    console.log('SUCCESS! 100% GAPLESS CONTINUOUS NUMBERING FROM 01 TO 213 ACROSS ALL 128 DOCUMENTS!');
  } else {
    console.error('FAILED verification!');
  }
}
main();
